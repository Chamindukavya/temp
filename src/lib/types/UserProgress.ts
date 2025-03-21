import { Types } from "mongoose";

// Type for user's answer to SJT ranking question
export interface SJTRankingAnswer {
  questionId: string;
  rankings: string[]; // Ordered array of choice indices or IDs
}

// Type for user's answer to SJT best choice question
export interface SJTBestChoiceAnswer {
  questionId: string;
  selectedChoice: string; // Index or ID of the selected choice
}

// Union type for any SJT answer
export type SJTAnswer = SJTRankingAnswer | SJTBestChoiceAnswer;

// Type for a user's attempt at an SJT paper
export interface SJTAttempt {
  userId: string;
  paperId: string;
  answers: SJTAnswer[];
  startedAt: Date;
  completedAt?: Date;
  timeSpent?: number; // In seconds
  score?: number;
}

// MongoDB document version with _id
export interface SJTAttemptDocument extends SJTAttempt {
  _id: Types.ObjectId;
  __v?: number;
}

// Type for user's SJT paper progress statistics
export interface SJTProgressStats {
  userId: string;
  totalAttempts: number;
  totalCompleted: number;
  averageScore: number;
  bestScore: number;
  papersAttempted: string[]; // Array of paper IDs
  lastAttemptAt?: Date;
}

// MongoDB document version with _id
export interface SJTProgressStatsDocument extends SJTProgressStats {
  _id: Types.ObjectId;
  __v?: number;
} 