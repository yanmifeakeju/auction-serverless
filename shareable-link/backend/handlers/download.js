import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { BUCKET_NAME } = process.env
const EXPIRY_DEFAULT = 300

const s3Client = new S3Client()

export const handler = async (event, context) => {
  const { id } = event.pathParameters
  const key = `shareable/${id[0]}/${id[1]}/${id}`

  if (!id) return { statusCode: 400, body: 'Missing ID' }

  const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key })
  const downloadUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: EXPIRY_DEFAULT
  })

  return {
    statusCode: 301,
    headers: {
      Location: downloadUrl
    }
  }
}
