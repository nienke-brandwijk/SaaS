import { NextRequest, NextResponse } from 'next/server';
import { createNewVisionBoard } from '../../../src/controller/visionboard.controller';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { boardName, boardHeight, boardWidth, boardURL, userID } = body;  

    if (!boardName || !userID) {
      return NextResponse.json({ error: 'boardName and userID are required' }, { status: 400 });
    }

    const newBoard = await createNewVisionBoard({
      boardName,
      boardHeight: boardHeight || null,
      boardWidth: boardWidth || null,
      boardURL: boardURL || '', 
      userID,
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error creating vision board:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}