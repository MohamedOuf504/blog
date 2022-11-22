const mongoose = require("mongoose");
const InteractionSchema = new mongoose.Schema({

    body: {
        type: String

    },
    comment: {
        type: String

    },
    post: {
        type: String

    },
    createdBy: {
        type: mongoose.Types.ObjectId

    }

}, {
    timestamps: true
})

const Interaction = mongoose.model('interaction', InteractionSchema)
module.exports = {
    Interaction
}