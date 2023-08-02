import { createClient } from 'redis'

class RedisClient {
  constructor (url = null) {
    self.client = createClient(url)
  }

  async connect () {
    try {
      await self.client.connect()
    } catch (error) {
      console.error(`Could not connect to Redis: ${error}`)
    }
  }

  async insert (key, value) {
    await this.client.set(key, JSON.stringify(value))
  }

  async retrieve (key) {
    const value = await this.client.get(key)
    return JSON.parse(value)
  }

  async closeConnection () {
    // preferred method of disconnecting; waits for current transactions to complete
    try {
      await self.client.quit()
    } catch (error) {
      console.error(`Could not close connection to Redis: ${error}`)
      // force closing connection
      await self.disconnect()
    }
  }

  async disconnect () {
    // does not wait for ongoing transactions to complete
    try {
      await self.client.disconnect()
    } catch (error) {
      console.error(`Could not disconnect from Redis: ${error}`)
    }
  }
}

export default RedisClient
