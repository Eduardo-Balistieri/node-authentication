import redisClient from "../connection/redis"

const maxNumberOfFailedLogins = 3
const timeout = 50  //seconds

class RateLimiter {
  private static async getAttempts(email: string): Promise<number> {
    const storedAttempts = await redisClient.get(`email:${email}`)
    return storedAttempts ? parseInt(storedAttempts) : 0
  }

  static async isLimitExceeded(email: string): Promise<boolean> {
    const attempts = await this.getAttempts(email)
    return attempts >= maxNumberOfFailedLogins
  }

  static async updateAttempts(email: string) {
    const attempts = await this.getAttempts(email)
    if (attempts >= maxNumberOfFailedLogins) {
      await redisClient.set(`email:${email}`, maxNumberOfFailedLogins, "EX", timeout)
    }
    else {
      await redisClient.set(`email:${email}`, attempts + 1, "EX", timeout)
    }
  }

  static async clear(email: string) {
    await redisClient.del(`email:${email}`)
  }
}

export default RateLimiter