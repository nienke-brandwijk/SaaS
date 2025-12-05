import { NextRequest, NextResponse } from 'next/server';
import { deleteImage } from '../../../../src/controller/image.controller';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ imageID: string }> }
) {
  try {
    const params = await context.params;
    const imageID = parseInt(params.imageID);

    if (isNaN(imageID)) {
      return NextResponse.json(
        { error: 'Invalid image ID' },
        { status: 400 }
      );
    }

    await deleteImage(imageID);

    return NextResponse.json(
      { message: 'Image deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}