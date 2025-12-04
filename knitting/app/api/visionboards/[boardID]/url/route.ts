import { NextRequest, NextResponse } from 'next/server';
import { updateVisionBoardURL } from '../../../../../src/controller/visionboard.controller';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ boardID: string }> }
) {
  try {
    const params = await context.params;
    const boardID = parseInt(params.boardID);
    const { boardURL } = await request.json();

    if (isNaN(boardID)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    if (!boardURL) {
      return NextResponse.json(
        { error: 'boardURL is required' },
        { status: 400 }
      );
    }

    const updatedBoard = await updateVisionBoardURL(boardID, boardURL);

    return NextResponse.json(updatedBoard, { status: 200 });
  } catch (error) {
    console.error('Error updating board URL:', error);
    return NextResponse.json(
      { error: 'Failed to update board URL' },
      { status: 500 }
    );
  }
}