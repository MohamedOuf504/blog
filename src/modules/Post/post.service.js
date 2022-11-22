const { Post } = require("./post.model");


const getPostCount = async () => {

    const approvedPosts = await Post.countDocuments({ 'status': 'APPROVED' })
    const pendingPosts = await Post.countDocuments({ 'status': 'PENDING' })
    const rejectedPosts = await Post.countDocuments({ 'status': 'REJECTED' })
    const allPosts = approvedPosts + pendingPosts + rejectedPosts

    return {
        allPosts, approvedPosts, pendingPosts, rejectedPosts
    }
}

module.exports = {
    getPostCount
}