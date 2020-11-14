import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import AWS from "aws-sdk";
import cors from "../../data/cors.json";

export const get = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): Promise<void> => {
  let responseBody;
  let statusCode = 200;

  const catalogName = event.queryStringParameters.name;
  const catalogPath = "uploaded/" + catalogName;

  const s3 = new AWS.S3({ region: "eu-west-1", signatureVersion: "v4" });
  const params = {
    Bucket: "node-aws-product-imports",
    Key: catalogPath,
    Expires: 60,
    ContentType: "text/csv",
  };
  try {
    responseBody = await s3.getSignedUrl("putObject", params);
  } catch (err) {
    responseBody = err;
    statusCode = 500;
  }

  let response = {
    statusCode: statusCode,
    headers: cors,
    body: responseBody,
    isBase64Encoded: false,
  };
  callback(null, response);
};
