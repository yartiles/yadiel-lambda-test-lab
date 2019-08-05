const { expect } = require('chai')
const logr = require('@everymundo/simple-logr')
const sinon = require('sinon')

describe('index.js', () => {
  const noop = () => {}

  let box
  beforeEach(() => {
    box = sinon.createSandbox()
    box.stub(logr, 'info').callsFake(noop)
  })

  afterEach(() => { box.restore() })

  describe('#handleApiGatewayRequest', () => {
    context('when called with VALID argument', () => {
      it('should not throw an error', async () => {
        const { handleApiGatewayRequest } = require('../handler-for-api-gateway-events')

        const input = { Some: 'Json' }
        const data = Buffer.from(JSON.stringify(input), 'utf8').toString('base64')
        const event = { Records: [{ kinesis: { data } }] }
        const res = await handleApiGatewayRequest(event)

        expect(res).to.have.property('headers')
        expect(res).to.have.property('body')
      })
    })
  })
})
