const { Comment } = require("./Comment.model");

const getCommentsCount = async () => {

    const countComments = await Comment.countDocuments({})

    return countComments

}

module.exports = {
    getCommentsCount
}