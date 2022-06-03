import { Router } from "express"

import ParametersValidation from "../middlewares/ParametersValidation"
import AuthController from "../controllers/AuthController"

const routes = Router()
routes.post(
  "/sign-up",   //cadastro
  ParametersValidation.signUp,
  AuthController.signUp
)
routes.post(
  "/sign-in",   //entrar
  ParametersValidation.signIn,
  AuthController.signIn
)
routes.get(
  "/sign-out",  //sair
  ParametersValidation.signOut,
  AuthController.signOut
)
routes.get(
  "/users",
  ParametersValidation.getUsers,
  AuthController.getUsers
)

export default routes