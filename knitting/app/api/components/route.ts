import { NextRequest, NextResponse } from 'next/server';
import {
  createAndLinkComponent,
  createAndLinkMultipleComponents,
} from '../../../src/controller/component.controller';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate boardID
    if (!body.boardID) {
      return NextResponse.json(
        { error: 'boardID is required' },
        { status: 400 }
      );
    }

    const boardID = body.boardID;

    // Check if it's an array (multiple components) or single component
    if (Array.isArray(body.components)) {
      
      const newComponents = await createAndLinkMultipleComponents(
        body.components,
        boardID
      );
      
      return NextResponse.json(newComponents, { status: 201 });
    } else if (body.component) {
      
      const newComponent = await createAndLinkComponent(
        body.component,
        boardID
      );
      
      return NextResponse.json(newComponent, { status: 201 });
    } else {
      return NextResponse.json(
        { error: 'Either "component" or "components" array is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating component(s):', error);
    return NextResponse.json(
      { 
        error: 'Failed to create component(s)',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}