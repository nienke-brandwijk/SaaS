import { NextRequest, NextResponse } from "next/server";
import { createNewCalculation } from "../../../src/controller/calculation.controller";

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