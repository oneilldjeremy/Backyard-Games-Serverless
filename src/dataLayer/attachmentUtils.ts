import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3()

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function createAttachmentPresignedUrl(
    gameId: string,
): Promise<string> {

    console.log(`Obtaining a presigned URL for game with id ${gameId}`);

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: gameId,
        Expires: parseInt(urlExpiration)
    })
  }