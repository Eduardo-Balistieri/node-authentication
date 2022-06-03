import { Express } from "express"
import AuthRoutes from "./AuthRoutes"

const useRoutes = (app: Express) => {
  app.use(AuthRoutes)
}

export default useRoutes