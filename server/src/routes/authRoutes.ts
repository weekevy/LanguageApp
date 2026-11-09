import { Router } from 'express'
import {
  credentialsLogin,
  login,
  register,
  socialLogin,
} from '../controllers/authController.js'
import { validateBody } from '../middleware/validation.js'
import {
  credentialsLoginSchema,
  mockLoginSchema,
  registerSchema,
  socialAuthSchema,
} from '../validators/authValidators.js'

export const authRouter = Router()
authRouter.post('/login', validateBody(mockLoginSchema), login)
authRouter.post(
  '/credentials',
  validateBody(credentialsLoginSchema),
  credentialsLogin,
)
authRouter.post('/register', validateBody(registerSchema), register)
authRouter.post('/social', validateBody(socialAuthSchema), socialLogin)
