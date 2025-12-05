import { NextRequest, NextResponse } from 'next/server';
import { deleteVisionBoard } from '../../../../src/service/visionboard.service';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ boardID: string }> }  
) {
  try {
    const params = await context.params;  
    const boardID = parseInt(params.boardID);

    if (isNaN(boardID)) {
      return NextResponse.json(
        { error: 'Invalid board ID' },
        { status: 400 }
      );
    }

    await deleteVisionBoard(boardID);

    return NextResponse.json(
      { message: 'Vision board deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting vision board:', error);
    return NextResponse.json(
      { error: 'Failed to delete vision board' },
      { status: 500 }
    );
  }
}