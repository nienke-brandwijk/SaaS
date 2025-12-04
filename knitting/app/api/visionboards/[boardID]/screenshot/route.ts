import { NextRequest, NextResponse } from 'next/server';
import { deleteOldBoardScreenshot } from '../../../../../src/controller/visionboard.controller';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ boardID: string }> }
) {
  try {
    const { boardURL } = await request.json();

    if (!boardURL) {
      return NextResponse.json(
        { error: 'boardURL is required' },
        { status: 400 }
      );
    }

    await deleteOldBoardScreenshot(boardURL);

    return NextResponse.json(
      { message: 'Screenshot deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to delete screenshot' },
      { status: 500 }
    );
  }
}