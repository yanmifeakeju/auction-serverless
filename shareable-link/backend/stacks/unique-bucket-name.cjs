const { createHash } = require('node:crypto')

module.exports = async ({ options, resolveVariable }) => {
  const account = await resolveVariable('aws:accountId')
  const region = await resolveVariable('aws:region')
  const stage = await resolveVariable('sls:stage')
  const input = `shareable-${account}-${region}-${stage}`
  const bucketName = `shareable-${createHash('md5')
    .update(input)
    .digest('hex')}`

  return {
    bucketName
  }
}
