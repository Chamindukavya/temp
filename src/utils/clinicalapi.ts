'use client';

import { submitClinicalAnswers, getUserClinicalResult } from '@/app/actions/clinicalPaperActions';

type OptionLabel = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "NA";

export interface SaveClinicalAnswersParams {
  paper: string;
  answers: {
    questionId: string;
    selectedOption: OptionLabel;
    isCorrect: boolean;
  }[];
  score: number;
  maxScore: number;
  percentageScore: number;
  timeTaken: number;
}

// Client-side wrapper for the server action
export const saveClinicalAnswers = async (params: SaveClinicalAnswersParams) => {
  try {
    const result = await submitClinicalAnswers(params);
    return result;
  } catch (error) {
    console.error('Error in saveClinicalAnswers:', error);
    throw error;
  }
};

// Client-side wrapper for fetching results
export const getClinicalResult = async (paperId: string) => {
  try {
    const result = await getUserClinicalResult(paperId);
    return result;
  } catch (error) {
    console.error('Error in getClinicalResult:', error);
    throw error;
  }
}; 