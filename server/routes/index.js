import express from 'express'
import makeRequest from '../src/data.js'
import redisClient from '../src/database.js'
const router = express.Router()

router.get('/', function (req, res, next) {
  const bountifulNinjaSessionCookie = req.cookies.bountifulNinjaSessionCookie
  if (bountifulNinjaSessionCookie === undefined || bountifulNinjaSessionCookie === null) {
    res.redirect('/auth/login')
  } else {
    res.render('index', { title: 'Bountiful Ninja' })
  }
})

router.get('/test', async (req, res, next) => {
  const bountifulNinjaSessionCookie = req.cookies.bountifulNinjaSessionCookie
  const result = await redisClient.retrieve(bountifulNinjaSessionCookie)
  const id = result.membershipId
  const token = result.accessToken
  await makeRequest(id, token)
})

export default router
