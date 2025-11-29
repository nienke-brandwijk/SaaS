import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { deleteWIPYarn } from '../../../../src/controller/yarn.controller';

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
    const yarnID = parseInt(id);

    await deleteWIPYarn(yarnID);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in yarn DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete yarn' },
      { status: 500 }
    );
  }
}