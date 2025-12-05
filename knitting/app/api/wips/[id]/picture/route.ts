import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { uploadWIPImage, deleteWIPImage, updateWIPPicture } from '../../../../../src/controller/wips.controller';

// PUT = Upload nieuwe image OF gebruik visionboard URL
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const wipID = parseInt(id);
    
    // Check content type om te bepalen of het FormData of JSON is
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Visionboard scenario - JSON met imageUrl
      const body = await request.json();
      const { imageUrl } = body;

      if (!imageUrl) {
        return NextResponse.json(
          { error: 'No image URL provided' },
          { status: 400 }
        );
      }

      // Update WIP met visionboard URL (geen upload nodig)
      await updateWIPPicture(wipID, imageUrl);

      return NextResponse.json({ success: true, url: imageUrl }, { status: 200 });
    } else {
      // Uploaded file scenario - FormData
      const formData = await request.formData();
      const imageFile = formData.get('image') as File | null;
      const deleteUrl = formData.get('deleteUrl') as string | null;

      if (!imageFile) {
        return NextResponse.json(
          { error: 'No image provided' },
          { status: 400 }
        );
      }

      // Eerst oude image verwijderen als die bestaat
      if (deleteUrl) {
        await deleteWIPImage(deleteUrl);
      }

      // Upload nieuwe image
      const publicUrl = await uploadWIPImage(imageFile, wipID, user.id);
      await updateWIPPicture(wipID, publicUrl);

      return NextResponse.json({ success: true, url: publicUrl }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in wips picture PUT:', error);
    return NextResponse.json(
      { error: 'Failed to upload picture' },
      { status: 500 }
    );
  }
}