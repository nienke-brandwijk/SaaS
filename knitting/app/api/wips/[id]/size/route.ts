import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../../lib/auth';
import { updateWIPSize } from '../../../../../src/controller/wips.controller';

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
    const { wipSize } = await request.json();

    if (wipSize === undefined) {
        return NextResponse.json(
            { error: 'Size parameter is required' },
            { status: 400 }
        );
    }

    const updatedWIP = await updateWIPSize(wipID, wipSize);

    return NextResponse.json(updatedWIP, { status: 200 });
  } catch (error) {
    console.error('Error in WIP size PUT:', error);
    return NextResponse.json(
      { error: 'Failed to update WIP size' },
      { status: 500 }
    );
  }
}