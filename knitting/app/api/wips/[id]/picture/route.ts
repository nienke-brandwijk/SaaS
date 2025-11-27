import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { uploadWIPImage, deleteWIPImage, updateWIPPicture } from '../../../../../src/controller/wips.controller';

// PUT = Upload nieuwe image (en verwijder oude als nodig)
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
  } catch (error) {
    console.error('Error in wips picture PUT:', error);
    return NextResponse.json(
      { error: 'Failed to upload picture' },
      { status: 500 }
    );
  }
}

// DELETE = Alleen verwijderen (geen nieuwe image)
export async function DELETE(
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
    const formData = await request.formData();
    const deleteUrl = formData.get('deleteUrl') as string | null;

    if (!deleteUrl) {
      return NextResponse.json(
        { error: 'No image URL provided' },
        { status: 400 }
      );
    }

    // Verwijder de image
    await deleteWIPImage(deleteUrl);
    await updateWIPPicture(wipID, null);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in wips picture DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete picture' },
      { status: 500 }
    );
  }
}