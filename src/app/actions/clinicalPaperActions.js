'use server'
import ClinicalPaper from "@/models/clinicalPaper";
import UserClinicalAnswer from "@/models/UserClinicalAnswer";
import dbConnect from "@/lib/mongoose";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const getClinicalPapers = async () => {
    try {
      await dbConnect();
      const papers = await ClinicalPaper.find().lean(); 
      const plainPapers = papers.map(paper => {
        const plainPaper = {
          ...paper,
          _id: paper._id.toString(), 
        };
  
        plainPaper.questions = plainPaper.questions.map((question) => {
          return {
            ...question,
            _id: question._id ? question._id.toString():null,
            options: question.options.map((option) => {
              return {
                ...option,
                _id: option._id ? option._id.toString() : null, 
              };
            }),
          };
        });
  
        return plainPaper;
      });
  
      return plainPapers;
    } catch (error) {
      console.error("Error fetching papers:", error);
      throw error;
    }
  };
  
  

export const getClinicalPaperById = async (id) => {
    try {
      await dbConnect();
      const paper = await ClinicalPaper.findById(id).lean();
  
      if (!paper) {
        throw new Error('Paper not found');
      }
  
      const plainPaper = {
        ...paper,
        _id: paper._id.toString(),
      };
  
      plainPaper.questions = plainPaper.questions.map((question) => ({
        ...question,
        _id: question._id.toString(),
        options: question.options.map((option) => ({
          ...option,
          _id: option._id ? option._id.toString() : null,
        })),
      }));
  
      return plainPaper;
    } catch (error) {
      console.error('Error fetching paper:', error);
      throw error;
    }
  };
  
export async function submitClinicalAnswers(data) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error('You must be logged in to submit answers');
    }
    
    const userId = session.user.id;
    
    // Create the user answer record
    const userAnswer = await UserClinicalAnswer.create({
      user: userId,
      paper: data.paper,
      answers: data.answers,
      score: data.score,
      maxScore: data.maxScore,
      percentageScore: data.percentageScore,
      timeTaken: data.timeTaken
    });
    
    revalidatePath(`/quizzes/clinicalPapers/${data.paper}`);
    revalidatePath('/dashboard');
    revalidatePath(`/progress/${userId}`);
    
    return {
      success: true,
      data: JSON.parse(JSON.stringify(userAnswer))
    };
  } catch (error) {
    console.error('Error submitting clinical answers:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getUserClinicalResult(paperId) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error('You must be logged in to view results');
    }
    
    const userId = session.user.id;
    
    // Fetch the user's answer for this paper
    const userAnswer = await UserClinicalAnswer.findOne({
      user: userId,
      paper: paperId
    }).populate('paper');
    
    if (!userAnswer) {
      return {
        success: false,
        error: 'No results found for this paper'
      };
    }
    
    return {
      success: true,
      data: JSON.parse(JSON.stringify(userAnswer))
    };
  } catch (error) {
    console.error('Error fetching clinical result:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get all results for a specific user
export async function getUserResults(userId) {
  try {
    await dbConnect();
    
    // For authenticated users, check if the request is for their own data
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'admin';
    const isOwnData = session?.user?.id === userId;
    
    if (!session || (!isAdmin && !isOwnData)) {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }
    
    // Fetch all results for this user
    const userAnswers = await UserClinicalAnswer.find({
      user: userId
    }).populate('paper').sort({ completedAt: -1 }).lean();
    
    return {
      success: true,
      data: JSON.parse(JSON.stringify(userAnswers))
    };
  } catch (error) {
    console.error('Error fetching user results:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get specific quiz result for a user
export async function getUserQuizResult(userId, paperId) {
  try {
    await dbConnect();
    
    // For authenticated users, check if the request is for their own data
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'admin';
    const isOwnData = session?.user?.id === userId;
    
    if (!session || (!isAdmin && !isOwnData)) {
      return {
        success: false,
        error: 'Unauthorized access'
      };
    }
    
    // Fetch the specific result
    const result = await UserClinicalAnswer.findOne({
      user: userId,
      paper: paperId
    }).populate('paper').lean();
    
    if (!result) {
      return {
        success: false,
        error: 'Result not found'
      };
    }
    
    return {
      success: true,
      data: JSON.parse(JSON.stringify(result))
    };
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
  
  
