import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { finishWIP } from '../../../../../src/controller/wips.controller';

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

    const updatedWIP = await finishWIP(wipID);

    return NextResponse.json(updatedWIP, { status: 200 });
  } catch (error) {
    console.error('Error in WIP finish PUT:', error);
    return NextResponse.json(
      { error: 'Failed to finish WIP' },
      { status: 500 }
    );
  }
}