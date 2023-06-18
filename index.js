import express from 'express'
import AppInit from './src/utils/app.init.js'
import cors from 'cors'
const app = express()
app.use(cors())

AppInit(app, express)


