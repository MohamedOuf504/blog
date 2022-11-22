const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({

    body: {
        type: String
    },
    post: {
        type: mongoose.Types.ObjectId

    },
    createdBy: {
        type: mongoose.Types.ObjectId
    }

}, {
    timestamps: true
})

const Comment = mongoose.model('comment', CommentSchema)
module.exports = {
    Comment
}