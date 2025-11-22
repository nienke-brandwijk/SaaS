import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { createWIPExtraMaterial } from '../../../src/controller/extraMaterials.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { extraMaterialsDescription, wipID } = await request.json();

    if (!extraMaterialsDescription || !wipID) {
      return NextResponse.json(
        { error: 'Description and WIP ID are required' },
        { status: 400 }
      );
    }

    const newExtraMaterial = await createWIPExtraMaterial(extraMaterialsDescription, wipID);

    return NextResponse.json(newExtraMaterial, { status: 201 });
  } catch (error) {
    console.error('Error in extra material POST:', error);
    return NextResponse.json(
      { error: 'Failed to create extra material' },
      { status: 500 }
    );
  }
}