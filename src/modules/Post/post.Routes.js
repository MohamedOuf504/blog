const { CreatePost, getPosts } = require("./post.Controller");
const authController = require("../User/auth.Controller");

const postRouter = require("express").Router();

postRouter.use(authController.protect);

postRouter.post('/posts', CreatePost)

postRouter.use(authController.restrictTo('ADMIN', 'USER'));

postRouter.get('/posts', getPosts)

module.exports = {
    postRouter
}