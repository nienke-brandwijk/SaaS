import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { deleteWIPGaugeSwatch } from '../../../../src/controller/gaugeSwatch.controller';

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
    const gaugeID = parseInt(id);

    await deleteWIPGaugeSwatch(gaugeID);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in gauge swatch DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete gauge swatch' },
      { status: 500 }
    );
  }
}