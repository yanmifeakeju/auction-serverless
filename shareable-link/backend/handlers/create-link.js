import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'node:crypto'

const { BUCKET_NAME, BASE_URL } = process.env
const EXPIRY_DEFAULT = 24 * 60 * 60

const s3Client = new S3Client()

export const handler = async (event, context) => {
  const id = randomUUID()
  const key = `shareable/${id[0]}/${id[1]}/${id}`

  const downloadUrl = `${BASE_URL}/share/${id}`

  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  })

  const uploadURL = await getSignedUrl(s3Client, putCommand, {
    expiresIn: EXPIRY_DEFAULT
  })

  return {
    statusCode: 201,
    body: JSON.stringify({
      success: true,
      data: {
        uploadURL,
        downloadUrl,
        instruction: `
        Upload with: curl -X PUT -T <filename> ${uploadURL}

        Download with curl ${downloadUrl}
        `
      }
    })
  }
}
