import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { deletePatternQueue } from '../../../../src/controller/PatternQueue.controller';

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
    const patternQueueID = parseInt(id);

    await deletePatternQueue(patternQueueID);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in pattern-queue DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete pattern' },
      { status: 500 }
    );
  }
}