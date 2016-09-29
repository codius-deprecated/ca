'use strict'

const reduct = require('reduct')
const fs = require('fs')
const path = require('path')
const assert = require('chai').assert
const httpHelper = require('./helpers/http')
const App = require('../src/lib/app')
const envRestorer = require('env-restorer')
const Promise = require('bluebird')
const pem = Promise.promisifyAll(require('pem'))

describe('Certificates', function () {
  describe('POST /certificates', function () {
    beforeEach(function () {
      process.env.CA_CHAIN = fs.readFileSync(path.resolve(__dirname, '../example/intermediate/certs/ca-chain.cert.pem'), 'utf-8')
      process.env.CA_CERT = path.resolve(__dirname, '../example/intermediate/certs/intermediate.cert.pem')
      process.env.CA_KEY_FILE = path.resolve(__dirname, '../example/intermediate/private/intermediate.key.pem')
      process.env.CA_KEY_PASSPHRASE = 'secretpassword'
      process.env.CA_CONFIG_FILE = path.resolve(__dirname, '../example/intermediate/openssl.cnf')
      this.app = reduct(App)
      this.callback = this.app.callback()
    })

    afterEach(function () {
      envRestorer.restore()
    })

    it('when called with a valid certificate signing request should return a valid certificate', function * () {
      const res = yield httpHelper.simulateRequest(this.callback, {
        method: 'POST',
        url: '/certificates',
        body: {
          certificate_signing_request: fs.readFileSync(path.resolve(__dirname, '../example/example.com/csr/example.com.csr.pem'), 'utf-8')
        }
      })

      const result = res._getJSON()

      // CA chain must match what we expect
      assert.equal(
        result.ca_chain,
        fs.readFileSync(path.resolve(__dirname, '../example/intermediate/certs/ca-chain.cert.pem'), 'utf-8')
      )
      // Certificate must be valid
      assert.ok(yield pem.verifySigningChainAsync(
        result.certificate,
        [
          fs.readFileSync(path.resolve(__dirname, '../example/root/certs/ca.cert.pem'), 'utf-8'),
          result.ca_chain
        ]
      ))
    })
  })
})
