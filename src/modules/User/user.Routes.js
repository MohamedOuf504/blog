const userRouter = require("express").Router();
const authController = require("./auth.Controller");
userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);
module.exports = {
    userRouter
}