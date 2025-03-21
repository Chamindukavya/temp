import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import UserClinicalAnswer from '@/models/UserClinicalAnswer';
import User from '@/models/User';
import ClinicalPaper from '@/models/clinicalPaper';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    // Get the search params from the URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const paperId = searchParams.get('paperId');

    // Validate required parameters
    if (!userId || !paperId) {
      return NextResponse.json(
        { error: 'User ID and Paper ID are required' },
        { status: 400 }
      );
    }

    // Validate if the IDs are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(paperId)) {
      return NextResponse.json(
        { error: 'Invalid User ID or Paper ID format' },
        { status: 400 }
      );
    }

    // Connect to the database
    await dbConnect();

    // Ensure models are registered
    if (!mongoose.models.User) {
      mongoose.model('User', User.schema);
    }
    if (!mongoose.models.ClinicalPaper) {
      mongoose.model('ClinicalPaper', ClinicalPaper.schema);
    }

    // Find the most recent attempt for this paper by this user
    const userAnswers = await UserClinicalAnswer.findOne({
      user: new mongoose.Types.ObjectId(userId),
      paper: new mongoose.Types.ObjectId(paperId)
    })
    .sort({ createdAt: -1 }) // Sort by creation time, newest first
    .populate('user', 'name email')
    .populate('paper', 'title description');

    if (!userAnswers) {
      return NextResponse.json(
        { error: 'No answers found for this user and paper' },
        { status: 404 }
      );
    }

    // Return the answers with a success status
    return NextResponse.json({
      success: true,
      data: userAnswers,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user clinical answers:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
