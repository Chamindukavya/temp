import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';

type SubscriptionType = 'Silver' | 'Gold' | 'Platinum';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'You must be logged in to purchase a subscription' },
        { status: 401 }
      );
    }

    const { subscriptionType } = await request.json() as { subscriptionType: SubscriptionType };

    if (!['Silver', 'Gold', 'Platinum'].includes(subscriptionType)) {
      return NextResponse.json(
        { error: 'Invalid subscription type' },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate subscription duration based on type
    const durationInDays = {
      'Silver': 30,
      'Gold': 60,
      'Platinum': 90
    }[subscriptionType];

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationInDays);

    // Update user's subscription
    user.subscription = {
      type: subscriptionType,
      startDate,
      endDate,
      status: 'active'
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to ${subscriptionType} plan`,
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 