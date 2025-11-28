import { supabase } from '../../lib/supabaseClient';
import { Image } from '../domain/image';

export const uploadImage = async (file: File, userID: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userID}/${Date.now()}.${fileExt}`;
    const filePath = `vision-board-images/${fileName}`;

    const { data, error } = await supabase.storage
      .from('knittingImages')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('knittingImages')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const createImage = async (
  imageURL: string,
  imageHeight: number,
  imageWidth: number
): Promise<Image> => {
  const { data, error } = await supabase
    .from('Image')
    .insert([
      {
        imageURL,
        imageHeight,
        imageWidth,
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const linkImageToBoard = async (
  imageID: number,
  boardID: number
): Promise<void> => {
  const { error } = await supabase
    .from('VisionboardHasImage')  
    .insert([
      {
        boardID: boardID,      
        imageID: imageID    
      }
    ]);

  if (error) {
    console.error('❌ Link error details:', error);  
    throw new Error(`Failed to link image: ${error.message}`);
  }
};