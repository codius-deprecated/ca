'use strict'

const Promise = require('bluebird')
const pem = Promise.promisifyAll(require('pem'))
const fs = require('fs')

class CertificateController {
  * postResource () {
    const pemResult = yield pem.createCertificateAsync({
      serviceKey: fs.readFileSync(process.env.CA_KEY_FILE, 'utf-8'),
      serviceKeyPassword: process.env.CA_KEY_PASSPHRASE,
      serviceCertificate: fs.readFileSync(process.env.CA_CERT, 'utf-8'),
      csr: this.request.body.certificate_signing_request,
      days: 375,
      serial: 1004,
      extFile: process.env.CA_CONFIG_FILE
    })
    this.status = 201
    this.body = {
      ca_chain: process.env.CA_CHAIN,
      certificate: pemResult.certificate
    }
  }
}

module.exports = CertificateController
