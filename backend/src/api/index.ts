import { Router } from 'express'
import { adminRouter } from './adminRoutes'
import { feedbackRouter } from './feedback'
import { healthRouter } from './health'
import { responseRouter } from './responseRoutes'

const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use(feedbackRouter)
apiRouter.use(adminRouter)
apiRouter.use(responseRouter)

export default apiRouter
