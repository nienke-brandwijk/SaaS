import { NextRequest, NextResponse } from 'next/server';
import { updateComponentPositions } from '../../../../src/controller/component.controller';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      );
    }

    const updatedComponents = await updateComponentPositions(updates);

    return NextResponse.json(updatedComponents, { status: 200 });
  } catch (error) {
    console.error('Error updating component positions:', error);
    return NextResponse.json(
      { error: 'Failed to update component positions' },
      { status: 500 }
    );
  }
}