import { NextRequest, NextResponse } from 'next/server';
import { updateUserPremiumStatusController } from '../../../src/controller/user.controller'; 
// *** Zorg ervoor dat dit pad klopt! ***

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { status: 'error', errorMessage: 'userId is required.' },
        { status: 400 }
      );
    }

    // HERGEBRUIK: Roep de bestaande controller aan en geef 'false' mee.
    // Dit is de wijziging die u vroeg om te doen.
    const isPremium = false; 
    const updatedUser = await updateUserPremiumStatusController(userId, isPremium);
    
    return NextResponse.json(
      { 
        status: 'success', 
        data: updatedUser,
        message: 'Premium status successfully cancelled' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error cancelling premium status:', error);
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 500 }
    );
  }
}