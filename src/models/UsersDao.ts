import { database } from "../connection/sqlite"
import User from "../@types/User"

class UsersDao {
  static findByEmail = (email: string): Promise<User | undefined> => new Promise((resolve, reject) => {
    database.get(
      "SELECT * FROM users WHERE email=?",
      [email],
      (err, row: User | undefined) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(row)
        }
      })
  })

  static create = (user: User): Promise<void> => new Promise((resolve, reject) => {
    database.run(
      "INSERT INTO users(email, password) VALUES (?,?)",
      [user.email, user.password],
      (err) => {
        if (err) {
          reject(err)
        }
        else {
          resolve()
        }
      })
  })

  static findAll = (): Promise<User[]> => new Promise((resolve, reject) => {
    database.all(
      "SELECT * FROM users",
      (err, rows: User[]) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows)
        }
      })
  })
}

export default UsersDao