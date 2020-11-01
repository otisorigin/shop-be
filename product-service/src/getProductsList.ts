import {
  APIGatewayProxyCallback,
  APIGatewayAuthorizerEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import products from "../data/products.json";
import cors from "../data/cors.json";

export const get = (
  event: APIGatewayAuthorizerEvent,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): void => {
  let response = {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify(products),
    isBase64Encoded: false,
  };
  callback(null, response);
};
