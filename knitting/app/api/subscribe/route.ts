import { NextRequest, NextResponse } from 'next/server';
import { updateUserPremiumStatusController } from '../../../src/controller/user.controller';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, priceId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'userId is required.' },
        { status: 400 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'priceId is required.' },
        { status: 400 }
      );
    }

    // Update user premium status naar true via controller
    const updatedUser = await updateUserPremiumStatusController(userId, true);
    
    return NextResponse.json(
      { 
        status: 'success', 
        data: updatedUser,
        message: 'Premium status successfully updated' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating premium status:', error);
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
}