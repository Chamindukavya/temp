import mongoose, { Schema, models } from 'mongoose';

const userClinicalAnswerSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paper: {
      type: Schema.Types.ObjectId,
      ref: 'ClinicalPaper',
      required: true,
    },
    answers: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        selectedOption: {
          type: String,
          enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'NA'],
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
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

// Create a non-unique compound index for better query performance
userClinicalAnswerSchema.index({ user: 1, paper: 1 });

const UserClinicalAnswer = models.UserClinicalAnswer || mongoose.model('UserClinicalAnswer', userClinicalAnswerSchema);

// Drop the existing unique index if it exists
if (mongoose.connection.readyState === 1) { // If connected to database
  UserClinicalAnswer.collection.dropIndex('user_1_paper_1')
    .catch(err => {
      if (err.code !== 27) { // Error code 27 means index doesn't exist, which is fine
        console.error('Error dropping index:', err);
      }
    });
}

export default UserClinicalAnswer; 