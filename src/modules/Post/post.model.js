const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    title: {
        type: String
    },
    body: {
        type: String

    },
    status: {
        type: String,
        enum: ["APPROVED", "PENDING", 'REJECTED'],
        default: "PENDING",
    },
    createdBy: {
        type: mongoose.Types.ObjectId

    }

}, {
    timestamps: true
})

const Post = mongoose.model('posts', postSchema)
module.exports = {
    Post
}