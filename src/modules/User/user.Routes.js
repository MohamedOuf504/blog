const userRouter = require("express").Router();
const authController = require("./auth.Controller");
userRouter.post("/user/signup", authController.signup);
userRouter.post("/user/login", authController.login);
userRouter.post("/admin/statistics", authController.protect, authController.restrictTo('ADMIN'), authController.login);
module.exports = {
    userRouter
}