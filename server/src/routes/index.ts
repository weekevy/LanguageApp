import { Router } from 'express'
import { authRouter } from './authRoutes.js'
import { demoRouter } from './demoRoutes.js'
import { healthRouter } from './healthRoutes.js'
import { suggestionRouter } from './suggestionRoutes.js'
import { transcriptRouter } from './transcriptRoutes.js'
import { translationRouter } from './translationRoutes.js'
import { userRouter } from './userRoutes.js'
import { videoRouter } from './videoRoutes.js'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/demo', demoRouter)
apiRouter.use('/video', videoRouter)
apiRouter.use('/transcript', transcriptRouter)
apiRouter.use('/translate', translationRouter)
apiRouter.use('/suggestions', suggestionRouter)
apiRouter.use('/user', userRouter)
apiRouter.use('/auth', authRouter)
