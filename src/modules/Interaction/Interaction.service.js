const { Interaction } = require("./Interaction.model");

const getInteractionCount = async () => {

    const commentsOnly = await Interaction.countDocuments({ 'comment': { $exists: true } })
    const postsOnly = await Interaction.countDocuments({ 'post': { $exists: true } })
    const allPostsAndComments = postsOnly + commentsOnly

    return {
        commentsOnly, postsOnly, allPostsAndComments
    }
}

module.exports = {
    getInteractionCount
}