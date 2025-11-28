import { NextRequest, NextResponse } from 'next/server';
import { componentImageController } from '../../../src/controller/component.controller';

export async function POST(req: NextRequest) {
  try {
    // Parse FormData in plaats van JSON
    const formData = await req.formData();
    
    const userID = formData.get('userID') as string;
    const boardID = formData.get('boardID') as string;
    const itemID = formData.get('itemID') as string;
    const imageFile = formData.get('image') as File;

    if (!userID || !boardID || !itemID || !imageFile) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Converteer File naar Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageURL = await componentImageController({
      userID,
      boardID: parseInt(boardID),
      itemID: parseInt(itemID),
      imageBuffer: buffer,
    });

    return NextResponse.json({ imageURL }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}