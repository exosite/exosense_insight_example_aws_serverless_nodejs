'use strict'
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const router = require('./router.js')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

app.use(cors())
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(router)

module.exports = app