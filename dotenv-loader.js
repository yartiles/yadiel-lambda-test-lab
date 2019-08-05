module.exports = (serverless) => {
  console.log(__filename, serverless.providers.aws.options)

  const { stage } = serverless.providers.aws.options

  const path = require('path').join(__dirname, `.env-${stage}`)

  const { parsed } = require('dotenv').config({ path })

  return parsed
}
