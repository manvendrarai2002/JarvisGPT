import { getApp } from './app.js'

async function start() {
    const app = await getApp()
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

// If running locally (not inside Vercel serverless), start the HTTP server.
if (!process.env.VERCEL) {
    start().catch((err) => {
        console.error('Failed to start server:', err)
        process.exit(1)
    })
}