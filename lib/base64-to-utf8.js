const base64toUTF8 = str => Buffer.from(str, 'base64').toString('utf8')

module.exports = { base64toUTF8 }
