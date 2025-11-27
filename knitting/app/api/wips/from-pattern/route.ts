import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { createWIPFromPattern } from '../../../../src/controller/wips.controller';
import { deletePatternQueue } from '../../../../src/controller/PatternQueue.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { patternName, patternQueueID } = await request.json();

    if (!patternName || !patternQueueID) {
      return NextResponse.json(
        { error: 'Pattern name and queue ID are required' },
        { status: 400 }
      );
    }

    // Stap 1: Maak WIP aan
    const newWIP = await createWIPFromPattern(patternName, user.id);
    
    // Stap 2: Verwijder uit queue
    await deletePatternQueue(patternQueueID);

    return NextResponse.json(newWIP, { status: 201 });
  } catch (error) {
    console.error('Error in wips/from-pattern POST:', error);
    return NextResponse.json(
      { error: 'Failed to create WIP from pattern' },
      { status: 500 }
    );
  }
}