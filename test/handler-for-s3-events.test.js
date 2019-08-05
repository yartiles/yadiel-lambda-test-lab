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

  describe('#handleS3Input', () => {
    context('when a record not coming from Kinesis is passed', () => {
      it('should not throw an error', async () => {
        const { handleS3Input } = require('../handler-for-s3-events')

        const event = { Records: [{ eventSource: 'aws:something-other-than-s3' }] }
        try {
          await handleS3Input(event)
        } catch (error) {
          return expect(error.message).to.include('Invalid eventSource')
        }

        expect(true).to.be.false('handleS3Input should throw an Error')
      })
    })

    context('when a record comes from a non authorized bucket', () => {
      beforeEach(() => {
        if (!process.env.S3_BUCKET) process.env.S3_BUCKET = ''

        box.stub(process.env, 'S3_BUCKET').value('MyWhiteListedBucket')
      })

      it('should not throw an error', async () => {
        const { handleS3Input } = require('../handler-for-s3-events')

        const bucket = { name: 'SomeKreizyBucketName' }
        const object = { key: 'some/path/of/some/file' }
        const event = { Records: [{ eventSource: 'aws:s3', s3: { bucket, object } }] }

        try {
          await handleS3Input(event)
        } catch (error) {
          expect(error.message).to.include('Invalid Bucket')
          expect(error.message).to.include(bucket.name)

          return
        }

        expect(true).to.be.false('handleS3Input should throw an Error')
      })
    })

    context('when called with VALID argument', () => {
      const emAWS = require('@everymundo/aws-s3-client')
      function S3 () {
        const response = { Body: Buffer.from('Some Fake Content') }

        function getObject (params, callback) {
          return callback
            ? callback(null, response)
            : { promise: () => Promise.resolve(response) }
        }

        this.getObject = getObject
      }

      beforeEach(() => {
        if (!process.env.S3_BUCKET) process.env.S3_BUCKET = ''

        box.stub(process.env, 'S3_BUCKET').value('MyWhiteListedBucket')
        box.stub(emAWS, 'S3').value(S3)
      })

      it('should not throw an error', async () => {
        const { handleS3Input } = require('../handler-for-s3-events')

        const expected = 'Some Fake Content'
        const bucket = { name: 'MyWhiteListedBucket' }
        const object = { key: 'some/path/of/some/file' }
        const event = { Records: [{ eventSource: 'aws:s3', s3: { bucket, object } }] }
        const res = await handleS3Input(event)

        expect(res).to.deep.equal([expected])
      })
    })
  })
})
