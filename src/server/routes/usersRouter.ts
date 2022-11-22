import express from "express";
import { usersLogin } from "../controllers/usersController";

const usersRouter = express.Router();

usersRouter.post("/login", usersLogin);

export default usersRouter;
