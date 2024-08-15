const aws = require("aws-sdk");
const sharp = require("sharp");
const s3 = new aws.S3();

exports.handler = async function (event, context) {
  console.log("Received S3 event:", JSON.stringify(event, null, 2));
  if (event.Records[0].eventName === "ObjectRemoved:Delete") {
    return;
  }
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;
  console.log(`Bucket: ${bucket}`, `Key: ${key}`);
  try {
    if (key.startsWith("50/") || key.startsWith("25/")) {
      console.log("NOT RESIZED IMAGE");
      return "NOT RESIZED IMAGE";
    }

    // get image from s3
    const imageS3 = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    // resize image
    const imageSharp = await sharp(imageS3.Body);
    const metadata = await imageSharp.metadata();
    if (metadata.width > 300 && metadata.height > 300) {
      const format = "jpeg";
      const resizedImage50 = await imageSharp[format]({ quality: 50 }).withMetadata().toBuffer();
      const resizedImage25 = await imageSharp[format]({ quality: 25 }).withMetadata().toBuffer();

      // store image
      console.log("RESIZED IMAGE");
      await s3.putObject({ Bucket: bucket, Key: `50/${key}`, Body: resizedImage50 }).promise();
      await s3.putObject({ Bucket: bucket, Key: `25/${key}`, Body: resizedImage25 }).promise();
      return "RESIZED IMAGE";
    } else {
      console.log("NOT RESIZED IMAGE");
      return "NOT RESIZED IMAGE";
    }
  } catch (err) {
    context.fail(`Error resizing image: ${err}`);
  }
};
