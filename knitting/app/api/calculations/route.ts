import { NextRequest, NextResponse } from "next/server";
import { createNewCalculation, deleteAllCalculations, deleteCalculation, updateCalculationWipID } from "../../../src/controller/calculation.controller";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationInputX, calculationInputY, calculationOutput, calculationName, userID } = body;

    const newCalculation = await createNewCalculation(
      calculationInputX,
      calculationInputY,
      calculationOutput,
      calculationName,
      userID
    );

    return NextResponse.json(newCalculation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const calculationID = searchParams.get('id');
    const deleteAll = searchParams.get('all');
    const userID = searchParams.get('userID'); 

    // Logica voor "Clear All"
    if (deleteAll === 'true' && userID) {
        await deleteAllCalculations(userID); 
        return NextResponse.json({ success: true, message: 'All calculations deleted' }, { status: 200 });
    }
    
    // Bestaande logica voor enkel verwijderen
    if (!calculationID) { 
      return NextResponse.json({ error: 'Calculation ID is required' }, { status: 400 });
    }

    await deleteCalculation(Number(calculationID)); 

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationID, wipID } = body;

    if (!calculationID || wipID === undefined) {
      return NextResponse.json(
        { error: 'Calculation ID and WIP ID are required' }, 
        { status: 400 }
      );
    }

    const finalWipID = (wipID === null || wipID === 0) ? null : Number(wipID);

    const updatedCalculation = await updateCalculationWipID(
      Number(calculationID), 
      finalWipID
    );

    return NextResponse.json(updatedCalculation, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}