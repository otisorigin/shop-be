import {
  APIGatewayProxyCallback,
  APIGatewayAuthorizerEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import products from "../data/products.json";

// eslint-disable-next-line import/prefer-default-export
export const get = (
  event: APIGatewayAuthorizerEvent,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): void => {
  let responseBody = products;

  let response = {
    statusCode: 200,
    headers: {
      my_header: "my_value",
    },
    body: JSON.stringify(responseBody),
    isBase64Encoded: false,
  };
  callback(null, response);
};
