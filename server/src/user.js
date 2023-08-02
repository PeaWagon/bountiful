import { DateTime } from 'luxon'

class UserSession {
  constructor (accessToken, membershipId, tokenExpiryDatetime, tokenType, state) {
    this.accessToken = accessToken
    this.membershipId = membershipId
    this.tokenExpiryDatetime = tokenExpiryDatetime
    this.tokenType = tokenType
    this.state = state
  }

  isExpired () {
    const utcNow = DateTime.utc()
    if (this.tokenExpiryDatetime === null) {
      throw new Error('Token expiry datetime is not available.')
    }
    return !(utcNow < this.tokenExpiryDatetime)
  }

  get sessionKey () {
    return `${this.membershipId}-${this.state}`
  }

  get sessionValue () {
    const sessionDetails = {
      accessToken: this.accessToken,
      membershipId: this.membershipId,
      tokenExpiryDatetime: this.tokenExpiryDatetime,
      tokenType: this.tokenType,
      state: this.state
    }
    return sessionDetails
  }

  updateToken (newAccessToken, newTokenExpiryDatetime, newTokenType) {
    this.accessToken = newAccessToken
    this.tokenExpiryDatetime = newTokenExpiryDatetime
    this.tokenType = newTokenType
  }

  close () {
    this.accessToken = null
    this.tokenExpiryDatetime = null
    this.tokenType = null
  }
}

export default UserSession
