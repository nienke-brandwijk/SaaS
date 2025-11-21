import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { createPatternQueue } from '../../../src/controller/PatternQueue.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { patternName, patternLink, patternPosition } = await request.json();

    if (!patternName || !patternLink || patternPosition === undefined) {
    return NextResponse.json(
        { error: 'Pattern name, link and position are required' },
        { status: 400 }
    );
    }

    const newPattern = await createPatternQueue(
    patternName, 
    patternLink, 
    patternPosition,
    user.id
    );

    return NextResponse.json(newPattern, { status: 201 });
  } catch (error) {
    console.error('Error in pattern-queue POST:', error);
    return NextResponse.json(
      { error: 'Failed to create pattern' },
      { status: 500 }
    );
  }
}