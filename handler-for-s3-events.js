const logr = require('@everymundo/simple-logr')
const emAWS = require('@everymundo/aws-s3-client')
const { env } = process

const handleS3Input = async (event) => {
  const { Records } = event
  logr.info(`working with ${Records.length} events`)

  const s3Client = new emAWS.S3()

  const results = []

  for (const record of Records) {
    if (record.eventSource !== 'aws:s3') {
      throw new Error(`Invalid eventSource! record.eventSource [${record.eventSource}] !== 'aws:s3'`)
    }

    if (record.s3.bucket.name !== env.S3_BUCKET) {
      throw new Error(`Invalid Bucket! [${record.s3.bucket.name}] is not [${env.S3_BUCKET}]`)
    }

    const Key = record.s3.object.key
    logr.info(Key)

    const data = await s3Client.getObject({ Bucket: env.S3_BUCKET, Key }).promise()

    logr.info(Key, Object.keys(data), data.constructor.name)

    results.push(data.Body.toString())
  }

  return results
}

module.exports = {
  handler: handleS3Input,
  handleS3Input
}
