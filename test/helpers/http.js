'use strict'

const MockIncomingMessage = require('readable-mock-req')
const MockServerResponse = require('mock-res')

exports.simulateRequest = function * (callback, requestOptions) {
  return new Promise((resolve, reject) => {
    const extraHeaders = {}
    let source = ''
    if (requestOptions.body) {
      if (typeof requestOptions.body === 'object') {
        source = JSON.stringify(requestOptions.body)
        extraHeaders['Content-Type'] = 'application/json'
      } else if (typeof requestOptions.body === 'string' || Buffer.isBuffer(requestOptions.body)) {
        source = requestOptions.body
      }
    }
    const req = new MockIncomingMessage(requestOptions.method, requestOptions.url, {
      headers: Object.assign({}, extraHeaders, requestOptions.headers),
      source
    })
    const res = new MockServerResponse(() => resolve(res))

    req.socket = { encrypted: false }

    res.on('error', reject)
    callback(req, res)
  })
}
