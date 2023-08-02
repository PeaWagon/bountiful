import express from 'express';
import OauthHandler from "../src/auth.js";

var router = express.Router();

const API_KEY = process.env.API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;


router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  const oauthHandler = new OauthHandler(CLIENT_ID);
  console.log(`client id: ${oauthHandler.clientId}`)
  res.redirect(oauthHandler.authorizationEndpoint);
});


router.get("/code", async (req, res, next) => {
  let code = req.query.code;
  let state = req.query.state;
  console.log(`the code is ${code} and the state is ${state}`)
  const oauthHandler = new OauthHandler(CLIENT_ID, state, code);
  await oauthHandler.getToken();
  res.cookie('bountifulNinjaSessionCookie', 'test-cookie', { maxAge: 900000, httpOnly: true });
  res.redirect("/");
});

router.get("/logout", (req, res, next) => {
  console.log("Logging out");
  res.redirect("/login");
});

// https://bountiful.ninja/login/code?code=28ad1ebaa6d444e99daab226224cd40c&state=TEST

export default router;
