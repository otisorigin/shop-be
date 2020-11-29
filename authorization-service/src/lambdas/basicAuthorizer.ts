import { APIGatewayEventRequestContext } from "aws-lambda";

export const handler = async (
  event,
  context: APIGatewayEventRequestContext,
  callback
): Promise<void> => {
  console.log("Event: ", JSON.stringify(event));

  if (event["type"] != "TOKEN") {
    callback("Unauthorized");
  }

  try {
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const username = plainCreds[0];
    const password = plainCreds[1];

    console.log("username : ${username} and password: ${password}");

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword != password ? "Deny" : "Allow";

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    callback(null, policy);
  } catch (e) {
    callback("Unauthorized");
  }
};

const generatePolicy = (principalId, resource, effect = "Allow") => {
  return {
    principalId: principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
