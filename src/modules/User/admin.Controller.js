const { getCommentsCount } = require("../Comment/Comment.service");
const { getInteractionCount } = require("../Interaction/Interaction.service");
const { getPostCount } = require("../Post/post.service");
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const statistics = catchAsync(async (req, res, next) => {
    const posts = await getPostCount()
    const comments = await getCommentsCount()
    const interactions = await getInteractionCount()

    res.status(200).json(
        {
            posts: { ...posts }, comments:  comments , interactions: { ...interactions }
        }
    )
})


module.exports = {
    statistics
}