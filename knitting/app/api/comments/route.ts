import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { createWIPComment } from '../../../src/controller/comment.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { commentContent, wipID } = await request.json();

    if (!commentContent || !wipID) {
      return NextResponse.json(
        { error: 'Comment content and WIP ID are required' },
        { status: 400 }
      );
    }

    const newComment = await createWIPComment(commentContent, wipID);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error in comment POST:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}