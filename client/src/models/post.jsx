import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  { title: String, bet: String, totalbet: Number },
  { timestamps: true }
);

const Post =
  mongoose.Aggregate.models.Post || mongoose.model("Post", postSchema);
export default Post;
