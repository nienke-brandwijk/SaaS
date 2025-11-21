import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { updatePatternPositions } from '../../../../src/controller/PatternQueue.controller';

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { updates } = await request.json();

    await updatePatternPositions(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering patterns:', error);
    return NextResponse.json(
      { error: 'Failed to reorder patterns' },
      { status: 500 }
    );
  }
}