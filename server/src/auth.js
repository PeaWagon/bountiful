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

import axios from 'axios'
import { DateTime } from 'luxon'

class OauthHandler {
  static tokenEndpoint = new URL('https://www.bungie.net/platform/app/oauth/token/')
  constructor (clientId, state = null, code = null) {
    this.clientId = clientId
    if (state === null) {
      state = OauthHandler.getNewState()
    }
    this.state = state
    this.code = code
  }

  async testConnection () {
    try {
      const response = await axios.get(this.authorizationEndpoint)
      console.log(`here is the response: ${response}`)
      console.log(response.headers)
      console.log(response.body)
      console.log(response.status)
    } catch (error) {
      console.error(`here is the error: ${error}`)
    }
  }

  static getNewState () {
    return 'TEST'
  }

  get authorizationEndpoint () {
    return new URL(
            `https://www.bungie.net/en/oauth/authorize?client_id=${this.clientId}&response_type=code&state=${this.state}&reauth=true`
    )
  }

  async getToken () {
    const tokenRequestDatetime = DateTime.utc()
    console.log(`Token request UTC datetime is: ${tokenRequestDatetime}`)
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    let response = null
    const data = `grant_type=authorization_code&code=${this.code}&client_id=${this.clientId}`
    try {
      response = await axios.post(OauthHandler.tokenEndpoint, data, config)
    } catch (error) {
      console.error(error)
    }
    if (response !== null) {
      const tokenExpiryDatetime = tokenRequestDatetime.plus({ seconds: response.data.expires_in })
      console.log(`Token expiry UTC datetime is: ${tokenExpiryDatetime}`)
      // console.log(`received response: ${response.data.access_token}`);
      // console.log(`received response: ${response.data.token_type}`);
      // console.log(`received response: ${response.data.expires_in}`);
      // console.log(`received response: ${response.data.membership_id}`);
    } else {
      console.error('Could not get token')
    }
  }
}

export default OauthHandler
