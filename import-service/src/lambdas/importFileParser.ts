import {
  APIGatewayProxyCallback,
  APIGatewayEventRequestContext,
} from "aws-lambda";
import AWS from "aws-sdk";
import csv from "csv-parser";
import cors from "../../data/cors.json";

export const get = async (
  event,
  context: APIGatewayEventRequestContext,
  callback: APIGatewayProxyCallback
): Promise<void> => {
  const s3 = new AWS.S3({ region: "eu-west-1" });

  console.log(event);
  event.Records.forEach((record) => {
    const s3Stream = s3
      .getObject({
        Bucket: "node-aws-product-imports",
        Key: record.s3.object.key,
      })
      .createReadStream();

    s3Stream
      .pipe(csv())
      .on("data", (data) => {
        console.log(data);
      })
      .on("end", async () => {
        console.log(
          "Copy from " + "node-aws-product-imports" + "/" + record.s3.object.key
        );

        await s3
          .copyObject({
            Bucket: "node-aws-product-imports",
            CopySource: "node-aws-product-imports" + "/" + record.s3.object.key,
            Key: record.s3.object.key.replace("uploaded", "parsed"),
          })
          .promise();

        console.log(
          "Copied into " +
            "node-aws-product-imports" +
            "/" +
            record.s3.object.key.replace("uploaded", "parsed")
        );
      });
  });

  let responseBody;
  let statusCode = 200;

  let response = {
    statusCode: statusCode,
    headers: cors,
    body: responseBody,
    isBase64Encoded: false,
  };
  callback(null, response);
};
