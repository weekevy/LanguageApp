import { Router } from 'express'
import { readDemoSession } from '../controllers/demoController.js'

export const demoRouter = Router()

demoRouter.get('/', readDemoSession)
