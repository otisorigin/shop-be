import {
  APIGatewayProxyCallback,
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import cors from "../../data/cors.json";
import { Client, ClientConfig } from "pg";
import dbOptions from "../../data/db";
import Product from "../models/Product";

const createProduct =
  "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *";

const createStock =
  "INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING count";

export const add = async (
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
    const schema = JSON.parse(event.body) as Product;
    const productResult = await client.query(createProduct, [
      schema.title,
      schema.description,
      schema.price,
    ]);
    const stockResult = await client.query(createStock, [
      productResult.rows[0].id,
      schema.count,
    ]);
    let product = productResult.rows[0] as Product;
    product.count = stockResult.rows[0].count;
    responseBody = JSON.stringify(product);
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
