import mongoose from "mongoose";
import SJTPaper from "@/models/SJTPaper";
import dbConnect from "@/lib/mongoose";
import { SJTPaperDocument } from "@/lib/types/SJTPaper";

// Define a simple filter type locally instead of importing from ApiTypes
interface QuizFilterOptions {
  search?: string;
  subject?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Get all SJT quizzes with optional filtering
 */
export const getSJTQuizzes = async (params?: QuizFilterOptions): Promise<SJTPaperDocument[]> => {
  try {
    await dbConnect();
    
    // Start with a base query
    let query = SJTPaper.find();
    
    // Apply search filter if provided
    if (params?.search) {
      query = query.or([
        { title: { $regex: params.search, $options: 'i' } },
        { paperDescription: { $regex: params.search, $options: 'i' } }
      ]);
    }
    
    // Apply subject filter if provided
    if (params?.subject) {
      query = query.where('subject', params.subject);
    }
    
    // Apply sorting (default to newest first)
    const sortField = params?.sort || 'createdAt';
    const sortOrder = params?.order === 'asc' ? 1 : -1;
    query = query.sort({ [sortField]: sortOrder });
    
    // Apply pagination if provided
    if (params?.page && params?.limit) {
      const skip = (params.page - 1) * params.limit;
      query = query.skip(skip).limit(params.limit);
    }
    
    const quizzes = await query.exec();
    return quizzes;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

/**
 * Get a quiz by ID
 */
export const getQuizById = async (id: string) => {
  try {
    await dbConnect();
    const quiz = await SJTPaper.findById(id);

    if (!quiz) {
      throw new Error('Quiz not found');
    }
    console.log("Quiz found:", quiz);
    return quiz;
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    throw error;
  }
}; 

/**
 * Create a new SJT paper
 */




