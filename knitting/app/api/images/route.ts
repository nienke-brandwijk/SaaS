import { NextRequest, NextResponse } from 'next/server';
import { uploadAndLinkImage } from '../../../src/controller/image.controller';

export async function GET() {
  console.log('✅ GET /api/images called');
  return NextResponse.json({ message: 'Images API is working' });
}

export async function POST(request: NextRequest) {
    console.log('✅ POST /api/images called');
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const userID = formData.get('userID') as string;
    const imageHeight = parseInt(formData.get('imageHeight') as string);
    const imageWidth = parseInt(formData.get('imageWidth') as string);
    const boardID = parseInt(formData.get('boardID') as string); 

    console.log('📋 Raw form values:', { 
      hasFile: !!file,
      fileName: file?.name,
      userID, 
      imageHeight, 
      imageWidth, 
      boardID 
    });

    if (!file || !userID || !boardID) { 
      return NextResponse.json(
        { error: 'Image, userID and boardID are required' },
        { status: 400 }
      );
    }

    const newImage = await uploadAndLinkImage( 
      file,
      userID,
      imageHeight,
      imageWidth,
      boardID 
    );

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json(
      { error: 'Failed to create image' },
      { status: 500 }
    );
  }
}