import { APIGatewayEventRequestContext } from "aws-lambda";
import cors from "../../data/cors.json";
import { Client, ClientConfig } from "pg";
import dbOptions from "../../data/db";
import Product from "../models/Product";
import AWS from "aws-sdk";

const createProduct =
  "INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING *";

const createStock =
  "INSERT INTO stocks (product_id, count) VALUES ($1, $2) RETURNING count";

export const add = async (
  event,
  context: APIGatewayEventRequestContext,
  callback
): Promise<void> => {
  let client;
  try {
    console.log(event);
    const products = event.Records.map(
      ({ body }) => JSON.parse(body) as Product
    ) as Product[];
    console.log(products);
    const sns = new AWS.SNS({ region: "eu-west-1" });
    client = new Client((dbOptions as unknown) as ClientConfig);
    await client.connect();
    for (let product of products) {
      console.log(product.title);
      const productResult = await client.query(createProduct, [
        product.title,
        product.description,
        product.price,
      ]);
      await client.query(createStock, [
        productResult.rows[0].id,
        product.count,
      ]);
      sns.publish(
        {
          Subject: "Product created",
          Message: JSON.stringify(product),
          TopicArn: process.env.SNS_ARN,
        },
        () => {
          console.log("Send email about created product");
        }
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    if (client) {
      client.end();
    }
  }
  callback(null, {
    statusCode: 200,
    headers: cors,
  });
};
