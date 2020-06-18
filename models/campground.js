const mongoose = require("mongoose");
const Comment = require("./comment");

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
	price: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            reference: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

campgroundSchema.pre('remove', async function() {
    await Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});

module.exports = Campground = mongoose.model("Campground", campgroundSchema);
