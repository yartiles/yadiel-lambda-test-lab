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

  describe('#handleKinesisInput', () => {
    context('when a record not coming from Kinesis is passed', () => {
      it('should not throw an error', async () => {
        const { handleKinesisInput } = require('../handler-for-kinesis-streams-events')

        const event = { Records: [{ eventSource: 'aws:something-other-than-kinesis' }] }
        try {
          await handleKinesisInput(event)
        } catch (error) {
          return expect(error.message).to.include('Invalid eventSource')
        }

        expect(true).to.be.false('handleKinesisInput should throw an Error')
      })
    })

    context('when called with VALID argument', () => {
      it('should not throw an error', async () => {
        const { handleKinesisInput } = require('../handler-for-kinesis-streams-events')

        const input = { Some: 'Json' }
        const data = Buffer.from(JSON.stringify(input), 'utf8').toString('base64')
        const event = { Records: [{ eventSource: 'aws:kinesis', kinesis: { data } }] }
        const res = await handleKinesisInput(event)

        expect(res).to.deep.equal([input])
      })
    })
  })
})
