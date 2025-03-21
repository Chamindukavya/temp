
import mongoose, { Schema, models } from 'mongoose';

const userSJTAnswerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paper: {
      type: Schema.Types.ObjectId,
      ref: 'SJTPaper',
      required: true, 
      
    },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        questionType: {
          type: String,
          enum: ['ranking', 'best_choice'],
          required: true,
        },
        // For ranking questions, store the order of choices
        // For best_choice questions, store the selected choice
        response: {
          type: Schema.Types.Mixed, // Array for ranking, String for best_choice
          required: true,
        },
        marks: {
          type: Number,
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
    },
    maxPossibleMarks: {
      type: Number,
      required: true,
    },
    percentageScore: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure a user can only have one answer set per paper
userSJTAnswerSchema.index({ user: 1, paper: 1 }, { unique: true });

const UserSJTAnswer = models.UserSJTAnswer || mongoose.model('UserSJTAnswer', userSJTAnswerSchema);

export default UserSJTAnswer; 