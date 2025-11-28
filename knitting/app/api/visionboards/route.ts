import { NextRequest, NextResponse } from 'next/server';
import { createNewVisionBoard } from '../../../src/controller/visionboard.controller';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      boardName, 
      boardHeight, 
      boardWidth, 
      userID 
    } = body;

    if (!userID || !boardName) {
      return NextResponse.json(
        { error: 'Board name and userID are required' },
        { status: 400 }
      );
    }

    const newBoard = await createNewVisionBoard({
      boardName,
      boardURL: '',
      boardHeight: boardHeight || null,
      boardWidth: boardWidth || null,
      userID
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    console.error('Error creating vision board:', error);
    return NextResponse.json(
      { error: 'Failed to create vision board' },
      { status: 500 }
    );
  }
}