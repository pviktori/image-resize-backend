# Node.js Image Service

This Node.js application provides services for handling image uploads, storing metadata in DynamoDB, and interacting with an S3 bucket. It includes functionalities to upload images, generate pre-signed URLs, and retrieve image metadata.

## Features

- **Image Upload**: Upload images to an S3 bucket and store metadata in DynamoDB.
- **Pre-Signed URL Generation**: Generate pre-signed URLs for accessing images.
- **Metadata Retrieval**: Retrieve image metadata from DynamoDB.
- **Local File Operations**: Stream files, get file buffers, and delete files locally.

## Prerequisites

- Node.js
- npm
- AWS Account with DynamoDB and S3 setup
- Environment variables set for AWS credentials and configurations

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository.git
   cd your-repository

## Create a .env file in the root directory and add your AWS configuration:

AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=your-region
AWS_DYNAMODB_TABLE_NAME=your-dynamodb-table-name
AWS_S3_BUCKET_NAME=your-s3-bucket-name
