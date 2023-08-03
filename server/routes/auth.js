import express from 'express'
import OauthHandler from '../src/auth.js'
import UserSession from '../src/user.js'
import redisClient from '../src/database.js'

const router = express.Router()

const CLIENT_ID = process.env.CLIENT_ID

router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login' })
})

router.post('/login', (req, res, next) => {
  const oauthHandler = new OauthHandler(CLIENT_ID)
  console.log(`client id: ${oauthHandler.clientId}`)
  console.log(`endpoint: ${oauthHandler.authorizationEndpoint}`)
  res.redirect(oauthHandler.authorizationEndpoint)
})

router.get('/code', async (req, res, next) => {
  const code = req.query.code
  const state = req.query.state
  console.log(`the code is ${code} and the state is ${state}`)
  const oauthHandler = new OauthHandler(CLIENT_ID, state, code)
  const tokenDetails = await oauthHandler.getTokenDetails()
  const userSession = new UserSession(
    tokenDetails.accessToken,
    tokenDetails.membershipId,
    tokenDetails.tokenExpiryDatetime,
    tokenDetails.tokenType,
    state
  )
  await redisClient.insert(userSession.sessionKey, userSession.sessionValue)
  res.cookie('bountifulNinjaSessionCookie', userSession.sessionKey, { maxAge: 900000, httpOnly: true })
  res.redirect('/')
})

router.get('/logout', async (req, res, next) => {
  console.log('Logging out')
  const bountifulNinjaSessionCookie = req.cookies.bountifulNinjaSessionCookie
  await redisClient.remove(bountifulNinjaSessionCookie)
  res.clearCookie('bountifulNinjaSessionCookie')
  res.redirect('/auth/login')
})

// https://bountiful.ninja/login/code?code=28ad1ebaa6d444e99daab226224cd40c&state=TEST

export default router
