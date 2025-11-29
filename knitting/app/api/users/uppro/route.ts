import { NextRequest, NextResponse } from 'next/server';
import { updateProgressController } from '../../../../src/controller/user.controller';
import { authenticate } from '../../helper';

export async function PUT(req: NextRequest) {
  try {
    const user = authenticate(req);
    return updateProgressController(req);
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', errorMessage: error.message },
      { status: 401 }
    );
  }
}