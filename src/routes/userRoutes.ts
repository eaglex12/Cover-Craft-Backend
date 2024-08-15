import { Router } from "express";
import UserController from "../controller/userController";
import hashPassword from "../middlewares/userAuthMiddleware";

const userRouter: Router = Router();

userRouter.post("/user/create", hashPassword, UserController.createUser);
userRouter.post("/user/update", hashPassword, UserController.updateUser);
userRouter.post("/user/delete", UserController.deleteUser);
userRouter.post("/user/get", UserController.getUser);

export default userRouter;
