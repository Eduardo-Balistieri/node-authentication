import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"   //gzip

import useRoutes from "./routes"

const app = express()
app.use(
  express.json(),
  cors(),
  helmet(),
  compression()
)
useRoutes(app)

export default app