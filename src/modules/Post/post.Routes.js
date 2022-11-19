const { CreatePost, getPosts } = require("./post.Controller");

const postRouter = require("express").Router();
postRouter.post('/', CreatePost)
postRouter.get('/', getPosts)
module.exports = {
    postRouter
}