import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import products from "../data/products.json";

// eslint-disable-next-line import/prefer-default-export
export const get = (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): void => {
  const product = products.filter(
    (product) => product.id === event.pathParameters.productId
  );
  let responseBody = {
    info: product,
  };

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
