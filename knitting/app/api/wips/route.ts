import { NextRequest, NextResponse } from 'next/server';
import { createNewWIP } from '../../../src/controller/wips.controller';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      wipName, 
      wipPictureURL, 
      wipBoardID, 
      wipFinished, 
      wipCurrentPosition, 
      wipSize, 
      wipChestCircumference, 
      wipEase, 
      userID 
    } = body;

    if (!userID || !wipName) {
      return NextResponse.json(
        { error: 'wip name and userID are required' },
        { status: 400 }
      );
    }

    const newWIP = await createNewWIP({
      wipName,
      wipPictureURL,
      wipBoardID,
      wipFinished,
      wipCurrentPosition,
      wipSize,
      wipChestCircumference,
      wipEase,
      userID
    });

    return NextResponse.json(newWIP, { status: 201 });
  } catch (error) {
    console.error('Error creating WIP:', error);
    return NextResponse.json(
      { error: 'Failed to create WIP' },
      { status: 500 }
    );
  }
}