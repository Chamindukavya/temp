import mongoose from "mongoose";

const ReplySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    replies: [ReplySchema],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
