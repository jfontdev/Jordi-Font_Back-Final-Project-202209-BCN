import express from "express";
import { usersLogin, usersRegister } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.post("/login", usersLogin);
usersRouter.post("/register", usersRegister);

export default usersRouter;
