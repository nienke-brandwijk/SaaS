import { NextRequest, NextResponse } from 'next/server';
import { deleteWIP } from '../../../../../src/controller/wips.controller';
import { getCurrentUser } from '../../../../../lib/auth';

export async function DELETE(
  request: NextRequest,
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

    if (isNaN(wipID)) {
      return NextResponse.json(
        { error: 'Invalid WIP ID' },
        { status: 400 }
      );
    }

    await deleteWIP(wipID);

    return NextResponse.json({ 
      success: true,
      message: 'WIP deleted successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in WIP delete:', error);
    return NextResponse.json(
      { error: 'Failed to delete WIP' },
      { status: 500 }
    );
  }
}