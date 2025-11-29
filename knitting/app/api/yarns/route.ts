import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/auth';
import { createWIPYarn } from '../../../src/controller/yarn.controller';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { yarnName, yarnProducer, wipID } = await request.json();

    if (!yarnName || !yarnProducer || !wipID) {
      return NextResponse.json(
        { error: 'Yarn name, producer and WIP ID are required' },
        { status: 400 }
      );
    }

    const newYarn = await createWIPYarn(yarnName, yarnProducer, wipID);

    return NextResponse.json(newYarn, { status: 201 });
  } catch (error) {
    console.error('Error in yarn POST:', error);
    return NextResponse.json(
      { error: 'Failed to create yarn' },
      { status: 500 }
    );
  }
}