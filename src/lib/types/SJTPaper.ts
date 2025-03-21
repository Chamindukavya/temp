import { Types } from "mongoose";
import { SJTQuestion, SJTPaper as BaseSJTPaper } from "./Quiz";

/**
 * MongoDB document version of SJTQuestion with _id
 */
export interface SJTQuestionDocument extends SJTQuestion {
  _id?: Types.ObjectId;
}

/**
 * MongoDB document version of SJTPaper with _id
 */
export interface SJTPaperDocument extends Omit<BaseSJTPaper, "_id"> {
  _id: Types.ObjectId;
  questions: SJTQuestionDocument[];
  createdAt: Date;
  __v?: number;
}

/**
 * SJTPaper with string ID (for client-side and API responses)
 */
export interface SJTPaperWithId extends Omit<BaseSJTPaper, "questions" | "createdAt"> {
  _id: string;
  questions: SJTQuestionDocument[];
  createdAt: Date;
}

/**
 * Response type for SJT paper lists
 */
export interface SJTPaperListResponse {
  papers: SJTPaperWithId[];
  total: number;
}

/**
 * Response type for a single SJT paper
 */
export interface SJTPaperResponse {
  paper: SJTPaperWithId;
} 