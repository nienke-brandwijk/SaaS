import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { createWIPGaugeSwatch } from '../../../src/controller/gaugeSwatch.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { gaugeStitches, gaugeRows, gaugeDescription, wipID } = await request.json();

    if (!gaugeStitches || !gaugeRows || !wipID) {
      return NextResponse.json(
        { error: 'Gauge stitches, rows and WIP ID are required' },
        { status: 400 }
      );
    }

    const newGaugeSwatch = await createWIPGaugeSwatch(
      parseInt(gaugeStitches), 
      parseInt(gaugeRows),
      gaugeDescription || '',
      wipID
    );

    return NextResponse.json(newGaugeSwatch, { status: 201 });
  } catch (error) {
    console.error('Error in gauge swatch POST:', error);
    return NextResponse.json(
      { error: 'Failed to create gauge swatch' },
      { status: 500 }
    );
  }
}