import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { createWIPNeedle } from '../../../src/controller/needle.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { needleSize, needlePart, wipID } = await request.json();

    if (!needleSize || !needlePart || !wipID) {
      return NextResponse.json(
        { error: 'Needle size, part, and WIP ID are required' },
        { status: 400 }
      );
    }

    const newNeedle = await createWIPNeedle(needleSize, needlePart, wipID);

    return NextResponse.json(newNeedle, { status: 201 });
  } catch (error) {
    console.error('Error in needles POST:', error);
    return NextResponse.json(
      { error: 'Failed to create needle' },
      { status: 500 }
    );
  }
}