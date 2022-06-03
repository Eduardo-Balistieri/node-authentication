import { Request, Response, NextFunction } from "express"
import jwt, { TokenExpiredError } from "jsonwebtoken"
import Validation from "../utils/Validation"

class ParametersValidation {
  static signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      Validation.email(email)
      Validation.password(password)
    }
    catch (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  }

  static signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      Validation.email(email)
      if (!password) {
        return res.status(400).json({ message: "Missing data" })
      }
    }
    catch (err) {
      return res.status(400).json({ message: err.message })
    }
    next()
  }

  static signOut(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization']
    if (!bearerHeader) {
      return res.status(400).json({ message: "Missing token" })
    }
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY
      const token = bearerHeader.replace(/^Bearer\s+/, "")
      jwt.verify(token, jwtSecretKey)
      req.headers['authorization'] = token
      next()
    }
    catch (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(400).json({ message: "Expired token" })
      }
      console.log(err.message)
      return res.sendStatus(500)
    }
  }

  static getUsers(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers['authorization']
    if (!bearerHeader) {
      return res.status(400).json({ message: "Missing token" })
    }
    try {
      const jwtSecretKey = process.env.JWT_SECRET_KEY
      const token = bearerHeader.replace(/^Bearer\s+/, "")
      jwt.verify(token, jwtSecretKey)
      req.headers['authorization'] = token
      next()
    }
    catch (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(400).json({ message: "Expired token" })
      }
      console.log(err.message)
      return res.sendStatus(500)
    }
  }
}

export default ParametersValidation