import redisClient from "../connection/redis"

class InvalidTokens {
  static async includes(token: string): Promise<boolean> {
    const existsRet = await redisClient.exists(`token:${token}`)
    return existsRet !== 0
  }

  static async add(token: string, value: number, expiresIn: number) {
    await redisClient.set(`token:${token}`, value, "EX", expiresIn)
  }
}

export default InvalidTokens