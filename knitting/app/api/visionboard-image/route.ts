import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const userID = formData.get('userID') as string;
    const boardID = formData.get('boardID') as string;
    const imageFile = formData.get('image') as File;

    if (!userID || !boardID || !imageFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Converteer File naar Buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload naar Supabase Storage
    const filePath = `vision-boards/${userID}/board-${boardID}-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('knittingImages')
      .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    // Haal public URL op
    const { data: publicUrlData } = supabase.storage
      .from('knittingImages')
      .getPublicUrl(filePath);

    return NextResponse.json({ imageURL: publicUrlData.publicUrl }, { status: 201 });

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error in visionboard-image API:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}