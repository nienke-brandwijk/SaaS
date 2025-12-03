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

export const getImagesByBoardID = async (boardID: number) => {
  const { data, error } = await supabase
    .from('VisionboardHasImage')
    .select(`
      imageID,
      Image (*)
    `)
    .eq('boardID', boardID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item: any) => item.Image);
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
    console.error('Link error details:', error);  
    throw new Error(`Failed to link image: ${error.message}`);
  }
};

export const deleteImage = async (imageID: number) => {
  // Haal image op om URL te krijgen
  const { data: image, error: fetchError } = await supabase
    .from('Image')
    .select('imageURL')
    .eq('imageID', imageID)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch image: ${fetchError.message}`);
  }

  // Verwijder link uit VisionboardHasImage
  const { error: linkError } = await supabase
    .from('VisionboardHasImage')
    .delete()
    .eq('imageID', imageID);

  if (linkError) {
    throw new Error(`Failed to delete image link: ${linkError.message}`);
  }

  // Verwijder image uit storage
  if (image.imageURL) {
    try {
      const url = new URL(image.imageURL);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'knittingImages');
      
      if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
        const imagePath = pathParts.slice(bucketIndex + 1).join('/');
        
        const { error: storageError } = await supabase.storage
          .from('knittingImages')
          .remove([imagePath]);

        if (storageError) {
          console.error('Error deleting image from storage:', storageError);
        }
      }
    } catch (e) {
      console.error('Error parsing image URL:', image.imageURL);
    }
  }

  // Verwijder image zelf
  const { error: deleteError } = await supabase
    .from('Image')
    .delete()
    .eq('imageID', imageID);

  if (deleteError) {
    throw new Error(`Failed to delete image: ${deleteError.message}`);
  }

  return { success: true };
};