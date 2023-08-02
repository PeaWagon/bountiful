import express from 'express'
const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  const bountifulNinjaSessionCookie = req.cookies.bountifulNinjaSessionCookie
  if (bountifulNinjaSessionCookie === undefined || bountifulNinjaSessionCookie === null) {
    res.redirect('/auth/login')
  } else {
    res.render('index', { title: 'Bountiful Ninja' })
  }
})

export default router
