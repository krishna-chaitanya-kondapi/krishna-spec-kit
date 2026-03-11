import { createApp } from './app'
import { env } from './config/env'

const startServer = async () => {
  const app = await createApp()

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server', error)
  process.exit(1)
})
