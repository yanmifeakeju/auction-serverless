import {
  Metrics,
  logMetrics,
  MetricUnits
} from '@aws-lambda-powertools/metrics'
import { Tracer, captureLambdaHandler } from '@aws-lambda-powertools/tracer'
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger'
import middy from '@middy/core'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const { BUCKET_NAME } = process.env
const EXPIRY_DEFAULT = 300

const tracer = new Tracer()
const logger = new Logger()
const metrics = new Metrics()

const s3Client = new S3Client()

const downloadFileContent = async (event, context) => {
  const { id } = event.pathParameters
  const key = `shareable/${id[0]}/${id[1]}/${id}`

  if (!id) return { statusCode: 400, body: 'Missing ID' }

  const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key })
  const downloadUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: EXPIRY_DEFAULT
  })

  logger.info('Downloading share', { id, key })
  metrics.addMetric('shareable.download', MetricUnits.Count, 1)

  return {
    statusCode: 301,
    headers: {
      Location: downloadUrl
    }
  }
}

export const handler = middy(downloadFileContent)
  .use(injectLambdaContext(logger, { logEvents: true }))
  .use(logMetrics(metrics))
  .use(captureLambdaHandler(tracer))
