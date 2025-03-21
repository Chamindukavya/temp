import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Count users
    const userCount = await User.countDocuments();
    
    // Return database status
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful',
      data: {
        databaseName: 'MSRA Prep',
        userCount,
        collections: ['users', 'questions', 'mockexams'],
        isConnected: true,
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
} 