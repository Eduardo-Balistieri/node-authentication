import app from "./src/app"
import dotenv from "dotenv"
import { init } from "./src/connection/sqlite"

const PORT = process.env.PORT || 3030
dotenv.config()
init()

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`)
})