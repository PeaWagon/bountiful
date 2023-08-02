/*
OAuth 2.0 Tokens
Important points taken from https://datatracker.ietf.org/doc/html/rfc6749#section-1.3:
* the client obtains an access token -- a string denoting a specific scope, lifetime,
  and other access attributes
* access tokens are issued to third-party clients by an authorization server with the
  approval of the resource owner
* the client uses the access token to access the protected resources hosted by the
  resource server

A typical workflow looks like:
1. The resource owner (end-user) wants to use this app (Bountiful Ninja - the client)
  to manage their bounties in the Destiny 2 game.
2. The resource owner permits Bountiful Ninja to access their bounties by logging
  into Destiny 2 account and getting an access code.
3. When Bountiful Ninja wants information about the end-user, they send a request
  to the Destiny 2 server (resource server) containing this access code.
*/

import axios from 'axios';
import express from 'express';
var router = express.Router();

const API_KEY = process.env.API_KEY;
const CLIENT_ID = process.env.CLIENT_ID;

const authorizationEndpoint = new URL(`https://www.bungie.net/en/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&state=TEST`);
const tokenEndpoint = new URL("https://www.bungie.net/platform/app/oauth/token/");


class OauthHandler {
  constructor(clientId, state=null) {
    this.clientId = clientId;
    if (state === null) {
      state = OauthHandler.getNewState();
    } 
    this.state = state;
  }

  async testConnection() {
    try {
      const response = await axios.get(this.authorizationEndpoint);
      console.log(`here is the response: ${response}`);
      console.log(response.headers);
      console.log(response.body);
      console.log(response.status);
    } catch (error) {
      console.error(`here is the error: ${error}`);
    }
  }

  static getNewState() {
    return "TEST"
  }

  get authorizationEndpoint() {
    return new URL(
      `https://www.bungie.net/en/oauth/authorize?client_id=${this.clientId}&response_type=code&state=${this.state}`
    );
  }

}

/* GET home page. */
router.get('/', function(req, res, next) {
  const oauthHandler = new OauthHandler(CLIENT_ID);
  console.log(`client id: ${oauthHandler.clientId}`)
  res.redirect(oauthHandler.authorizationEndpoint);
});



router.post("/code", (req, res, next) => {
  console.log('iam here');
    console.log(req.headers);
    console.log(req.statusCode);
    console.log(req.body);
    console.log(res.headers);
    console.log(res.statusCode);
    console.log(res.body);
    console.log(res.URL)
    res.redirect("../");
});

// https://bountiful.ninja/login/code?code=28ad1ebaa6d444e99daab226224cd40c&state=TEST

export default router;
