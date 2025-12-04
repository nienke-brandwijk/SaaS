import { NextRequest, NextResponse } from 'next/server';
import { updateVisionBoardTitle } from '../../../../../src/controller/visionboard.controller';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ boardID: string }> }
) {
  try {
    const params = await context.params;
    const boardID = parseInt(params.boardID);
    const body = await request.json();
    const { boardName } = body;

    if (isNaN(boardID)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    if (!boardName || boardName.trim() === '') {
      return NextResponse.json(
        { error: 'Board name is required' },
        { status: 400 }
      );
    }

    const updatedBoard = await updateVisionBoardTitle(boardID, boardName.trim());

    return NextResponse.json(updatedBoard, { status: 200 });
  } catch (error) {
    console.error('Error updating vision board title:', error);
    return NextResponse.json(
      { error: 'Failed to update vision board title' },
      { status: 500 }
    );
  }
}