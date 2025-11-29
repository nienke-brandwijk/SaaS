import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { updateWIPCurrentPosition } from '../../../../../src/controller/wips.controller';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const wipID = parseInt(id);
    const { wipCurrentPosition } = await request.json();

    if (wipCurrentPosition === undefined) {
      return NextResponse.json(
        { error: 'Current position parameter is required' },
        { status: 400 }
      );
    }

    const updatedWIP = await updateWIPCurrentPosition(wipID, wipCurrentPosition);

    return NextResponse.json(updatedWIP, { status: 200 });
  } catch (error) {
    console.error('Error in WIP current position PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update WIP current position' },
      { status: 500 }
    );
  }
}