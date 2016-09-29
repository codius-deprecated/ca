'use strict'

const Koa = require('koa')
const createRouter = require('koa-router')
const createBodyParser = require('koa-bodyparser')
const createLogger = require('koa-logger')
const CertificatesController = require('../controllers/certificates')

class App {
  constructor (deps) {
    this.koa = deps(Koa)
    this.controllerCertificate = deps(CertificatesController)
    this.router = this.setupRouter()
    this.koa.use(createLogger())
    this.koa.use(createBodyParser())
    this.koa.use(this.router.routes())
    this.koa.use(this.router.allowedMethods())
  }

  start () {
    this.koa.listen(3000)
  }

  callback () {
    return this.koa.callback()
  }

  setupRouter () {
    const router = createRouter()

    router.post('/certificates', this.controllerCertificate.postResource)

    return router
  }
}

module.exports = App
