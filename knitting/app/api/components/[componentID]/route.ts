import { NextRequest, NextResponse } from 'next/server';
import { deleteComponent } from '../../../../src/controller/component.controller';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ componentID: string }> }
) {
  try {
    const params = await context.params;
    const componentID = parseInt(params.componentID);

    if (isNaN(componentID)) {
      return NextResponse.json(
        { error: 'Invalid component ID' },
        { status: 400 }
      );
    }

    await deleteComponent(componentID);

    return NextResponse.json(
      { message: 'Component deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting component:', error);
    return NextResponse.json(
      { error: 'Failed to delete component' },
      { status: 500 }
    );
  }
}