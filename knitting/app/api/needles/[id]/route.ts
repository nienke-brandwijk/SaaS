import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { deleteWIPNeedle } from '../../../../src/controller/needle.controller';

export async function DELETE(
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
    const needleID = parseInt(id);

    await deleteWIPNeedle(needleID);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in needle DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete needle' },
      { status: 500 }
    );
  }
}