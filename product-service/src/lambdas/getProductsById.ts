import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import cors from "../../data/cors.json";
import { Client, ClientConfig } from "pg";
import dbOptions from "../../data/db";

const getProductByIdQury =
  "SELECT p.id, title, description, price, count FROM products p INNER JOIN stocks s ON p.id = s.product_id WHERE p.id = $1";

export const get = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): Promise<void> => {
  let responseBody;
  let statusCode = 200;
  let client;
  console.log(event);
  try {
    client = new Client((dbOptions as unknown) as ClientConfig);
    await client.connect();
    const result = await client.query(getProductByIdQury, [
      event.pathParameters.productId,
    ]);
    if (result.rows.length > 0) {
      responseBody = JSON.stringify(result.rows[0]);
    } else {
      statusCode = 404;
    }
  } catch (err) {
    responseBody = JSON.stringify(err);
    statusCode = 500;
  } finally {
    if (client) {
      client.end();
    }
  }
  let response = {
    statusCode: statusCode,
    headers: cors,
    body: responseBody,
    isBase64Encoded: false,
  };
  callback(null, response);
};
