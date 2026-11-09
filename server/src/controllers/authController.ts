import type { RequestHandler } from 'express'
import type {
  CredentialsLoginInput,
  MockLoginInput,
  RegisterInput,
  SocialAuthInput,
} from '@linguatube/shared'
import { successResponse } from '../lib/responses.js'
import {
  loginMockUser,
  loginWithCredentials,
  loginWithSocialProvider,
  registerLocalUser,
} from '../services/authService.js'

export const login: RequestHandler = (request, response) => {
  const input = request.validatedBody as MockLoginInput
  response.json(
    successResponse({
      user: loginMockUser(input),
      authentication: 'mock',
      warning: 'This local-development login is not production-secure.',
    }),
  )
}

const authResponse = (user: ReturnType<typeof loginMockUser>, method: string) =>
  successResponse({
    user,
    authentication: method,
    warning:
      'Local-development authentication must be replaced before production.',
  })

export const credentialsLogin: RequestHandler = (request, response) => {
  const input = request.validatedBody as CredentialsLoginInput
  response.json(authResponse(loginWithCredentials(input), 'credentials-mock'))
}

export const register: RequestHandler = (request, response) => {
  const input = request.validatedBody as RegisterInput
  response
    .status(201)
    .json(authResponse(registerLocalUser(input), 'registration-mock'))
}

export const socialLogin: RequestHandler = (request, response) => {
  const input = request.validatedBody as SocialAuthInput
  response.json(
    authResponse(loginWithSocialProvider(input), `${input.provider}-mock`),
  )
}
