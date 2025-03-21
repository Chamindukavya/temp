import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST() {
  try {
    await dbConnect();

    // Check if test user already exists
    let user = await User.findOne({ email: 'test@example.com' });

    if (user) {
      // Update existing user's subscription
      user.subscription = {
        type: 'Platinum',
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'active'
      };
      await user.save();
    } else {
      // Create new test user
      const hashedPassword = await bcrypt.hash('test123', 10);
      user = await User.create({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'user',
        subscription: {
          type: 'Platinum',
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          status: 'active'
        }
      });
    }

    return NextResponse.json({ 
      message: 'Test user created/updated successfully',
      user: {
        email: user.email,
        name: user.name,
        subscription: user.subscription
      }
    });
  } catch (error: any) {
    console.error('Error creating test user:', error.message);
    return NextResponse.json(
      { error: `Failed to create test user: ${error.message}` },
      { status: 500 }
    );
  }
} 