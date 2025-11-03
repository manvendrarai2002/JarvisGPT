import serverless from 'serverless-http'
import { getApp } from '../app.js'

let cachedHandler = null

export default async function handler(req, res) {
  // get or build the express app
  const app = await getApp()

  // cache the serverless handler per warm instance
  if (!cachedHandler) cachedHandler = serverless(app)

  return cachedHandler(req, res)
}
