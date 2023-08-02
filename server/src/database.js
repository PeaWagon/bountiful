import { createClient } from 'redis'

class RedisClient {
  constructor (url = null) {
    this.client = createClient(url)
  }

  async connect () {
    try {
      await this.client.connect()
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

  async remove (key) {
    await this.client.del(key)
  }

  async closeConnection () {
    // preferred method of disconnecting; waits for current transactions to complete
    try {
      await this.client.quit()
    } catch (error) {
      console.error(`Could not close connection to Redis: ${error}`)
      // force closing connection
      await this.disconnect()
    }
  }

  async disconnect () {
    // does not wait for ongoing transactions to complete
    try {
      await this.client.disconnect()
    } catch (error) {
      console.error(`Could not disconnect from Redis: ${error}`)
    }
  }
}
const redisClient = new RedisClient()
await redisClient.connect()

export default redisClient
