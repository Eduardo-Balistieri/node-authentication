import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import UsersDao from "../models/UsersDao"
import RateLimiter from "../data/RateLimiter"
import InvalidTokens from "../data/InvalidTokens"

const saltRounds = 12

class AuthController {
  static async signUp(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      const user = await UsersDao.findByEmail(email)
      if (user) {
        res.status(400).json({ message: "This e-mail is already registered" })
      }
      else {
        const hash = bcrypt.hashSync(password, saltRounds)
        UsersDao.create({ id: 0, email, password: hash })
        res.sendStatus(201)
      }
    }
    catch (err) {
      console.log(err.message)
      res.sendStatus(500)
    }
  }

  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body
    try {
      const user = await UsersDao.findByEmail(email)
      if (!user) {
        res.status(400).json({ message: "Invalid e-mail or password" })
      }
      else {
        const isLimitExceeded = await RateLimiter.isLimitExceeded(email)
        if (isLimitExceeded) {
          return res.status(429).json({ message: "Too many attempts, try again later" })
        }
        const isCorrect = bcrypt.compareSync(password, user.password)
        if (!isCorrect) {
          RateLimiter.updateAttempts(email)
          res.status(400).json({ message: "Invalid e-mail or password" })
        }
        else {
          const jwtSecretKey = process.env.JWT_SECRET_KEY
          const token = jwt.sign({ id: user.id }, jwtSecretKey, { expiresIn: '50s' })
          RateLimiter.clear(email)
          res.setHeader('authorization', `Bearer ${token}`)
          res.sendStatus(200)
        }
      }
    }
    catch (err) {
      console.log(err.message)
      res.sendStatus(500)
    }
  }

  static async signOut(req: Request, res: Response) {
    try {
      const token = req.headers["authorization"]
      const payload = jwt.decode(token) as JwtPayload
      const now = Math.round(new Date().getTime() / 1000)
      await InvalidTokens.add(token, payload.exp, payload.exp - now)
      res.sendStatus(200)
    }
    catch (err) {
      console.log(err.message)
      res.sendStatus(500)
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const token = req.headers["authorization"]
      const includes = await InvalidTokens.includes(token)
      if (includes) {
        res.status(400).json({ message: "Token invalidated by logout" })
      }
      else {
        const users = await UsersDao.findAll()
        res.status(200).json({ users })
      }
    }
    catch (err) {
      console.log(err.message)
      res.sendStatus(500)
    }
  }
}

export default AuthController