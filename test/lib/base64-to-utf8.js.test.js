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

  describe('#base64toUTF8', () => {
    context('when called with invalid arguments', () => {
      it('should throw an error', () => {
        const { base64toUTF8 } = require('../../lib/base64-to-utf8')

        const caller = () => base64toUTF8()
        expect(caller).to.throw(Error)
      })
    })

    context('when called with VALID base64 string', () => {
      it('should decode the string', () => {
        const { base64toUTF8 } = require('../../lib/base64-to-utf8')

        const expected = '{"name":"Daniel","status":"Awesome","team":"DataCore"}'
        const res = base64toUTF8('eyJuYW1lIjoiRGFuaWVsIiwic3RhdHVzIjoiQXdlc29tZSIsInRlYW0iOiJEYXRhQ29yZSJ9')

        expect(res).to.equal(expected)
      })
    })
  })
})
