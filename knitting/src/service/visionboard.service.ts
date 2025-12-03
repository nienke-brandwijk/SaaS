import { supabase } from '../../lib/supabaseClient';
import { VisionBoard } from '../domain/visionboard';

export const getBoardsByUserID = async (userID: string): Promise<VisionBoard[]> => {

  const { data, error } = await supabase
    .from('Visionboard')
    .select('*')
    .eq('userID', userID)
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export const deleteVisionBoard = async (boardID: number): Promise<void> => {
  // Haal eerst het board op om de boardURL te krijgen
  const { data: board, error: fetchError } = await supabase
    .from('Visionboard')
    .select('boardURL')
    .eq('boardID', boardID)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch board: ${fetchError.message}`);
  }

  // Haal alle components op die bij dit board horen
  const { data: componentLinks, error: componentsQueryError } = await supabase
    .from('VisionboardHasComponent')
    .select(`
      componentID,
      Component (
        componentURL,
        componentType
      )
    `)
    .eq('boardID', boardID);

  if (componentsQueryError) {
    throw new Error(`Failed to fetch components: ${componentsQueryError.message}`);
  }

  // Verwijder component images uit storage 
  if (componentLinks && componentLinks.length > 0) {
    const imageComponents = componentLinks
      .filter((link: any) => link.Component?.componentType === 'image' && link.Component?.componentURL)
      .map((link: any) => link.Component.componentURL);

    if (imageComponents.length > 0) {
        const imagePaths = imageComponents
        .map(url => {
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const bucketIndex = pathParts.findIndex(part => part === 'knittingImages');
            if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
              return pathParts.slice(bucketIndex + 1).join('/');
            }
          } catch (e) {
            console.error('Error parsing component URL:', url);
          }
          return null;
        })
        .filter(path => path !== null) as string[];

      if (imagePaths.length > 0) {
        const { error: imageStorageError } = await supabase.storage
          .from('knittingImages')
          .remove(imagePaths);

        if (imageStorageError) {
          console.error('Error deleting component images from storage:', imageStorageError);
        }
      }
    }
  }

  // Haal alle images op die bij dit board horen via VisionboardHasImage
  const { data: imageLinks, error: imagesQueryError } = await supabase
    .from('VisionboardHasImage')
    .select(`
      imageID,
      Image (
        imageURL
      )
    `)
    .eq('boardID', boardID);

  if (imagesQueryError) {
    throw new Error(`Failed to fetch images: ${imagesQueryError.message}`);
  }

  // Verwijder image files uit storage
  if (imageLinks && imageLinks.length > 0) {
    const imageURLs = imageLinks
      .filter((link: any) => link.Image?.imageURL)
      .map((link: any) => link.Image.imageURL);

    if (imageURLs.length > 0) {
      const imagePaths = imageURLs
        .map(url => {
          try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const bucketIndex = pathParts.findIndex(part => part === 'visionboard-images');
            if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
              return pathParts.slice(bucketIndex + 1).join('/');
            }
          } catch (e) {
            console.error('Error parsing image URL:', url);
          }
          return null;
        })
        .filter(path => path !== null) as string[];

      if (imagePaths.length > 0) {
        const { error: imageStorageError } = await supabase.storage
          .from('visionboard-images')
          .remove(imagePaths);

        if (imageStorageError) {
          console.error('Error deleting images from storage:', imageStorageError);
        }
      }
    }
  }

  // Verwijder de board screenshot uit storage
  if (board && board.boardURL) {
      try {
        const url = new URL(board.boardURL);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.findIndex(part => part === 'knittingImages');
        
        if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
          const boardImagePath = pathParts.slice(bucketIndex + 1).join('/');
          
          const { error: boardStorageError } = await supabase.storage
            .from('knittingImages')
            .remove([boardImagePath]);

        if (boardStorageError) {
          console.error('Error deleting board image from storage:', boardStorageError);
        }
      }
    } catch (e) {
      console.error('Error parsing board URL:', board.boardURL);
    }
  }

  // Verwijder links uit VisionboardHasComponent
  const { error: componentLinksError } = await supabase
    .from('VisionboardHasComponent')
    .delete()
    .eq('boardID', boardID);

  if (componentLinksError) {
    throw new Error(`Failed to delete component links: ${componentLinksError.message}`);
  }

  // Verwijder links uit VisionboardHasImage
  const { error: imageLinksError } = await supabase
    .from('VisionboardHasImage')
    .delete()
    .eq('boardID', boardID);

  if (imageLinksError) {
    throw new Error(`Failed to delete image links: ${imageLinksError.message}`);
  }

  // Verwijder orphaned components 
  if (componentLinks && componentLinks.length > 0) {
    const componentIDs = componentLinks.map((link: any) => link.componentID);
    
    for (const componentID of componentIDs) {
      const { data: otherLinks, error: checkError } = await supabase
        .from('VisionboardHasComponent')
        .select('componentID')
        .eq('componentID', componentID)
        .limit(1);

      if (!checkError && (!otherLinks || otherLinks.length === 0)) {
        await supabase
          .from('Component')
          .delete()
          .eq('componentID', componentID);
      }
    }
  }

  // Verwijder orphaned images 
  if (imageLinks && imageLinks.length > 0) {
    const imageIDs = imageLinks.map((link: any) => link.imageID);
    
    for (const imageID of imageIDs) {
      const { data: otherLinks, error: checkError } = await supabase
        .from('VisionboardHasImage')
        .select('imageID')
        .eq('imageID', imageID)
        .limit(1);

      if (!checkError && (!otherLinks || otherLinks.length === 0)) {
        await supabase
          .from('Image')
          .delete()
          .eq('imageID', imageID);
      }
    }
  }

  // Verwijder het visionboard zelf
  const { error: boardError } = await supabase
    .from('Visionboard')
    .delete()
    .eq('boardID', boardID);

  if (boardError) {
    throw new Error(`Failed to delete vision board: ${boardError.message}`);
  }
};

export const getBoardByID = async (boardID: number): Promise<VisionBoard | null> => {
  const { data, error } = await supabase
    .from('Visionboard')
    .select('*')
    .eq('boardID', boardID)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || null;
};

export const createVisionBoard = async (
  boardName: string,
  userID: string,
  boardHeight: number | null = null,
  boardWidth: number | null = null,
  boardURL: string = ''
): Promise<VisionBoard> => {
  const { data, error } = await supabase
    .from('Visionboard')
    .insert([
      {
        boardName,
        userID,
        boardHeight,
        boardWidth,
        boardURL, 
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const updateVisionBoardTitle = async (
  boardID: number,
  boardName: string
): Promise<VisionBoard> => {
  const { data, error } = await supabase
    .from('Visionboard')
    .update({ boardName })
    .eq('boardID', boardID)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteOldBoardScreenshot = async (boardURL: string): Promise<void> => {
  if (!boardURL) return;

  try {
    const url = new URL(boardURL);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'knittingImages');
    
    if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
      const imagePath = pathParts.slice(bucketIndex + 1).join('/');
      
      const { error: storageError } = await supabase.storage
        .from('knittingImages')
        .remove([imagePath]);

      if (storageError) {
        console.error('Error deleting old board screenshot:', storageError);
        throw new Error(`Failed to delete old screenshot: ${storageError.message}`);
      }
      
    }
  } catch (e) {
    console.error('Error deleting board screenshot:', e);
    throw e;
  }
};

export const updateVisionBoardURL = async (
  boardID: number,
  boardURL: string
): Promise<VisionBoard> => {
  const { data, error } = await supabase
    .from('Visionboard')
    .update({ boardURL })
    .eq('boardID', boardID)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export default {
  getBoardsByUserID,
  createVisionBoard,
  deleteVisionBoard
};