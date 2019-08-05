const logr = require('@everymundo/simple-logr')

const convert = require('./lib/base64-to-utf8')

const handleKinesisInput = async (event) => {
  const { Records } = event
  logr.info(`working with ${Records.length} events`)

  return Records.map((record) => {
    if (record.eventSource !== 'aws:kinesis') {
      throw new Error(`Invalid eventSource! record.eventSource [${record.eventSource}] !== 'aws:kinesis'`)
    }

    const doc = JSON.parse(convert.base64toUTF8(record.kinesis.data))

    logr.info(doc)

    return doc
  })
}

module.exports = {
  handler: handleKinesisInput,
  handleKinesisInput
}
