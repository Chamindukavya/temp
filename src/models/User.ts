import mongoose, { Schema, models } from 'mongoose';
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    subscription: {
      type: {
        type: String,
        enum: ['Silver', 'Gold', 'Platinum', null],
        default: null
      },
      startDate: {
        type: Date,
        default: null
      },
      endDate: {
        type: Date,
        default: null
      },
      status: {
        type: String,
        enum: ['active', 'not_subscribed'],
        default: 'not_subscribed'
      }
    },
    // Reference to active subscription

  

    progress: {
      questionsAttempted: {
        type: Number,
        default: 0,
      },
      questionsCorrect: {
        type: Number,
        default: 0,
      },
      examsCompleted: {
        type: Number,
        default: 0,
      },
      // Add performance metrics for each paper type
      clinical: {
        papersAttempted: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
        highestScore: {
          type: Number,
          default: 0,
        },
        totalQuestionsAttempted: {
          type: Number,
          default: 0,
        },
        totalCorrectAnswers: {
          type: Number,
          default: 0,
        },
      },
      sjt: {
        papersAttempted: {
          type: Number,
          default: 0,
        },
        averageScore: {
          type: Number,
          default: 0,
        },
        highestScore: {
          type: Number,
          default: 0,
        },
        totalQuestionsAttempted: {
          type: Number,
          default: 0,
        },
      },
    },
    // References to user's answers
    clinicalAnswers: [{
      type: Schema.Types.ObjectId,
      ref: 'UserClinicalAnswer',
    }],
    sjtAnswers: [{
      type: Schema.Types.ObjectId,
      ref: 'UserSJTAnswer',
    }],
  },
  
  { timestamps: true }
);

const User = models.User || mongoose.model('User', userSchema);

export default User; 