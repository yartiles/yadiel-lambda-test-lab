const { expect } = require('chai')
const logr = require('@everymundo/simple-logr')
const sinon = require('sinon')

describe('handler-for-load-balancer-events.js', () => {
  const noop = () => {}

  let box
  beforeEach(() => {
    box = sinon.createSandbox()
    box.stub(logr, 'info').callsFake(noop)
  })

  afterEach(() => { box.restore() })

  describe('#handleALBRequest', () => {
    context('when called with VALID argument', () => {
      it('should not throw an error', async () => {
        const { handleALBRequest } = require('../handler-for-load-balancer-events')

        const input = { Some: 'Json' }
        const data = Buffer.from(JSON.stringify(input), 'utf8').toString('base64')
        const event = { Records: [{ kinesis: { data } }] }
        const res = await handleALBRequest(event)

        expect(res).to.have.property('headers')
        expect(res).to.have.property('body')
      })
    })
  })
})
