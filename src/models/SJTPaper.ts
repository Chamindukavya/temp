import mongoose, { Schema, model, models } from "mongoose";

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["ranking", "best_choice"],
  },
  answer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  choices: {
    type: [String],
    required: true,
  },
});

const SJTPaperSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  paperDescription: {
    required: true,
    type: String,
  },
  subject: {
    required: true,
    type: String,
  },
  questions: [QuestionSchema],
  timeLimit: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Ensure the model is not recompiled in hot-reloading
const SJTPaper = models.SJTPaper || model('SJTPaper', SJTPaperSchema);

export default SJTPaper;
