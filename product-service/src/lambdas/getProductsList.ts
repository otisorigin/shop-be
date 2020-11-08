import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import { Client, ClientConfig } from "pg";
import cors from "../../data/cors.json";
import dbOptions from "../../data/db";

const getProductsQuery =
  "SELECT p.id, title, description, price, count FROM products p INNER JOIN stocks s ON p.id = s.product_id";

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
    const result = await client.query(getProductsQuery);
    responseBody = JSON.stringify(result.rows);
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

export const getProducts = async () => {};
