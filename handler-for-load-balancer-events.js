// const logr = require('@everymundo/simple-logr')

const handleALBRequest = async (event, context) => {
  const body = JSON.stringify({
    message: 'Hello from Lambda!',
    event, //  WARNING: exposing event   for learning purpose only, do not deploy this to production
    context // WARNING: exposing context for learning purpose only, do not deploy this to production
  })

  const response = {
    statusCode: 200,
    body,
    headers: {
      'content-type': 'application/json'
    }
  }

  return response
}

module.exports = {
  handler: handleALBRequest,
  handleALBRequest
}
