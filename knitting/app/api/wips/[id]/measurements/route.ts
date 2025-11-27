import { NextRequest, NextResponse } from 'next/server';
import { updateWIPMeasurements } from '../../../../../src/controller/wips.controller';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;  
    const wipID = parseInt(id);
    
    const body = await request.json();
    const { wipChestCircumference, wipEase } = body;

    console.log('Received measurements update:', { wipID, wipChestCircumference, wipEase });

    // Validatie
    if (isNaN(wipID)) {
      return NextResponse.json(
        { error: 'Invalid WIP ID' },
        { status: 400 }
      );
    }

    const updatedWIP = await updateWIPMeasurements(
      wipID,
      wipChestCircumference,
      wipEase
    );

    return NextResponse.json(updatedWIP, { status: 200 });
  } catch (error) {
    console.error('Error updating measurements:', error);
    return NextResponse.json(
      { error: 'Failed to update measurements', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}