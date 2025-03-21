import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import UserClinicalAnswer from '@/models/UserClinicalAnswer';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await dbConnect();
    console.log('Connected to MongoDB');

    // Get the request body
    const body = await request.json();
    console.log('Received request body:', body);

    const {
      user,
      paper,
      answers,
      score,
      maxScore,
      percentageScore,
      timeTaken,
      completedAt
    } = body;

    // Validate required fields
    if (!user || !paper || !answers || typeof score !== 'number' || typeof maxScore !== 'number' || typeof percentageScore !== 'number' || typeof timeTaken !== 'number') {
      console.log('Missing or invalid required fields:', { 
        user: !!user, 
        paper: !!paper, 
        answers: !!answers, 
        score: typeof score, 
        maxScore: typeof maxScore, 
        percentageScore: typeof percentageScore, 
        timeTaken: typeof timeTaken 
      });
      return NextResponse.json(
        { status: 'error', message: 'Missing or invalid required fields' },
        { status: 400 }
      );
    }

    // Validate answers array
    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Answers must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate each answer has required fields and valid ObjectIds
    for (const answer of answers) {
      if (!answer.questionId || !answer.selectedOption || typeof answer.isCorrect !== 'boolean') {
        console.log('Invalid answer format:', answer);
        return NextResponse.json(
          { status: 'error', message: 'Each answer must have questionId, selectedOption, and isCorrect fields' },
          { status: 400 }
        );
      }

      // Validate that questionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
        return NextResponse.json(
          { status: 'error', message: `Invalid questionId format: ${answer.questionId}` },
          { status: 400 }
        );
      }
    }

    // Create new clinical answer record
    console.log('Creating clinical answer record...');
    const clinicalAnswer = await UserClinicalAnswer.create({
      user,
      paper,
      answers,
      score,
      maxScore,
      percentageScore,
      timeTaken,
      completedAt: completedAt ? new Date(completedAt) : new Date()
    });
    console.log('Clinical answer record created:', clinicalAnswer);

    return NextResponse.json({
      status: 'success',
      message: 'Clinical answers saved successfully',
      data: clinicalAnswer,
    });
  } catch (error) {
    console.error('Error saving clinical answers:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to save clinical answers',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 