import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import products from "../data/products.json";
import cors from "../data/cors.json";

export const get = (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): void => {
  let responseBody = JSON.stringify({});
  let statusCode = 200;

  const product = products.filter(
    (product) => product.id === event.pathParameters.productId
  )[0];

  if (product) {
    responseBody = JSON.stringify(product);
  } else {
    statusCode = 404;
  }

  let response = {
    statusCode: statusCode,
    headers: cors,
    body: responseBody,
    isBase64Encoded: false,
  };
  callback(null, response);
};
