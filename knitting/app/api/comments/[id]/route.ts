import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../lib/auth';
import { deleteWIPComment } from '../../../../src/controller/comment.controller';

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
    const commentID = parseInt(id);

    await deleteWIPComment(commentID);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in comment DELETE:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}