import { supabase } from '../../lib/supabaseClient';
import { Image } from '../domain/image';

export const uploadImage = async (file: File, userID: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userID}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
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
  // 1. Haal image op om URL te krijgen
  const { data: image, error: fetchError } = await supabase
    .from('Image')
    .select('imageURL')
    .eq('imageID', imageID)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch image: ${fetchError.message}`);
  }

  // 2. Verwijder link uit VisionboardHasImage
  const { error: linkError } = await supabase
    .from('VisionboardHasImage')
    .delete()
    .eq('imageID', imageID);

  if (linkError) {
    throw new Error(`Failed to delete image link: ${linkError.message}`);
  }

  // 3. Check of er nog andere Image records zijn met dezelfde URL
  const { data: otherImagesWithSameURL, error: checkError } = await supabase
    .from('Image')
    .select('imageID')
    .eq('imageURL', image.imageURL)
    .neq('imageID', imageID);

  if (checkError) {
    console.error('Error checking for other images:', checkError);
  }

  const { data: componentsWithSameURL, error: componentCheckError } = await supabase
    .from('Component')
    .select('componentID')
    .eq('componentURL', image.imageURL)
    .eq('componentType', 'image');

  if (componentCheckError) {
    console.error('Error checking for components with same URL:', componentCheckError);
  }

  // 4. Verwijder image record uit database
  const { error: deleteError } = await supabase
    .from('Image')
    .delete()
    .eq('imageID', imageID);

  if (deleteError) {
    throw new Error(`Failed to delete image: ${deleteError.message}`);
  }

  // 5. Verwijder ALLEEN uit storage als:
  //    - Geen andere Image records deze URL gebruiken
  //    - EN geen Component records deze URL gebruiken
  const isURLStillInUse = 
    (otherImagesWithSameURL && otherImagesWithSameURL.length > 0) ||
    (componentsWithSameURL && componentsWithSameURL.length > 0);

  if (image.imageURL && !isURLStillInUse) {
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
        } else {
        }
      }
    } catch (e) {
      console.error('Error parsing image URL:', image.imageURL);
    }
  } else {
    const componentCount = componentsWithSameURL?.length || 0;
    const imageCount = otherImagesWithSameURL?.length || 0;
    console.log(`ℹ️ Image not deleted from storage - still in use by ${imageCount} other Image record(s) and ${componentCount} Component(s)`);
  }

  return { success: true };
};