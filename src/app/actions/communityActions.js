"use server"

import { error } from "console";
import Comment from "../../models/commentsModel";
import dbConnect from "@/lib/mongoose";


export async function getComments() {
    try {
      await dbConnect();
      const comments = await Comment.find().sort({ createdAt: -1 }).lean();
      const plainComments = comments.map(comment => {
        const plainComment = {
          ...comment,
          _id: comment._id.toString(),
          userId: comment.userId.toString(),
          replies: comment.replies.map((option) => ({
            ...option,
            userId: option.userId ? option.userId.toString() : null,
          }))
        };

        
        return plainComment;

      });
      return plainComments;
  
  
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

export async function postComments( userId, text){
  try{
    await dbConnect();

    if (!userId || !text) {
      console.error("no user id or text:", error);
      
    }
    const comment = new Comment({ userId, text });
    await comment.save();


  }catch(error){
    console.error("Error adding the comment:", error);

  }

}  

export async function postReplies(commentId, userId, replyText) {

  try{
    await dbConnect();

    if (!userId || !replyText ||!commentId) {
      console.error("no user id or text or commentId:", error);
    }
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.error("Comment not found",error)
    }

    comment.replies.push({ userId, text:replyText });
    await comment.save();

  }catch(error){
    console.error("Error adding reply:", error);
  }
  
}

  