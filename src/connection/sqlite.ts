import { Database } from "sqlite3"
import path from "path"

const dbPath = path.join(__dirname, "../data/sql/database.sqlite")
const database = new Database(dbPath, (err) => {
  if (err)
    console.log("SQLite database creation error: ", err.message)
})

const init = () => database.run(`
  CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL
  )
`)

export { database, init }