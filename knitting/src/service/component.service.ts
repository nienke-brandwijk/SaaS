import { supabase } from '../../lib/supabaseClient';
import { ComponentData } from '../domain/component';
    
export const uploadComponentImageToStorage = async (
  userID: string,
  boardID: number,
  itemID: number,
  imageBuffer: Buffer // Niet meer dataUrl, maar direct Buffer
): Promise<string> => {
  const filePath = `vision-board-images/${userID}/component-${itemID}.png`;

  const { error: uploadError } = await supabase.storage
    .from('knittingImages') 
    .upload(filePath, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Haal public URL op
  const { data: publicUrlData } = supabase.storage
    .from('knittingImages')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const getComponentsByBoardID = async (boardID: number) => {
  const { data, error } = await supabase
    .from('VisionboardHasComponent')
    .select(`
      componentID,
      Component (*)
    `)
    .eq('boardID', boardID);

  if (error) {
    throw new Error(error.message);
  }


  return data.map((item: any) => item.Component);
};


export const createComponent = async (componentData: ComponentData) => {
  const { data, error } = await supabase
    .from('Component')
    .insert([componentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating component:', error);
    throw new Error(`Failed to create component: ${error.message}`);
  }

  return data;
};

export const createMultipleComponents = async (components: ComponentData[]) => {
  const { data, error } = await supabase
    .from('Component')
    .insert(components)
    .select();

  if (error) {
    console.error('Error creating components:', error);
    throw new Error(`Failed to create components: ${error.message}`);
  }
  return data;
};

export const linkComponentToBoard = async (componentID: number, boardID: number) => {
  const { data, error } = await supabase
    .from('VisionboardHasComponent')
    .insert([{
      componentID: componentID,
      boardID: boardID
    }])
    .select();

  if (error) {
    console.error('Link error details:', error);
    throw new Error(`Failed to link component: ${error.message}`);
  }

  return data;
};

export const linkMultipleComponentsToBoard = async (
  componentIDs: number[], 
  boardID: number
) => {
  const links = componentIDs.map(componentID => ({
    componentID,
    boardID
  }));

  const { data, error } = await supabase
    .from('VisionboardHasComponent')
    .insert(links)
    .select();

  if (error) {
    console.error('Error linking components:', error);
    throw new Error(`Failed to link components: ${error.message}`);
  }

  return data;
};

export const updateComponentPosition = async (
  componentID: number,
  positionX: number,
  positionY: number,
  rotation?: number
) => {
  const updateData: any = {
    positionX,
    positionY
  };
  
  if (rotation !== undefined) {
    updateData.componentRotation = rotation;
  }

  const { data, error } = await supabase
    .from('Component')
    .update(updateData)
    .eq('componentID', componentID)
    .select()
    .single();

  if (error) {
    console.error('Error updating component position:', error);
    throw new Error(`Failed to update component position: ${error.message}`);
  }

  return data;
};

export const updateMultipleComponentPositions = async (
  updates: Array<{
    componentID: number;
    positionX: number;
    positionY: number;
    rotation?: number;
  }>
) => {
  const updatePromises = updates.map(update =>
    updateComponentPosition(update.componentID, update.positionX, update.positionY, update.rotation)
  );

  return Promise.all(updatePromises);
};

export const deleteComponent = async (componentID: number) => {
  // Haal component op om URL te krijgen (voor storage cleanup)
  const { data: component, error: fetchError } = await supabase
    .from('Component')
    .select('componentURL, componentType')
    .eq('componentID', componentID)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch component: ${fetchError.message}`);
  }

  // Verwijder link uit VisionboardHasComponent
  const { error: linkError } = await supabase
    .from('VisionboardHasComponent')
    .delete()
    .eq('componentID', componentID);

  if (linkError) {
    throw new Error(`Failed to delete component link: ${linkError.message}`);
  }

  // Verwijder component uit storage (alleen images)
  if (component.componentType === 'image' && component.componentURL) {
    try {
      const url = new URL(component.componentURL);
      const pathParts = url.pathname.split('/');
      const bucketIndex = pathParts.findIndex(part => part === 'knittingImages');
      
      if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
        const imagePath = pathParts.slice(bucketIndex + 1).join('/');
        
        const { error: storageError } = await supabase.storage
          .from('knittingImages')
          .remove([imagePath]);

        if (storageError) {
          console.error('Error deleting component image from storage:', storageError);
        }
      }
    } catch (e) {
      console.error('Error parsing component URL:', component.componentURL);
    }
  }

  // Verwijder component zelf
  const { error: deleteError } = await supabase
    .from('Component')
    .delete()
    .eq('componentID', componentID);

  if (deleteError) {
    throw new Error(`Failed to delete component: ${deleteError.message}`);
  }

  return { success: true };
};

export default {
  createComponent,
  createMultipleComponents,
  linkComponentToBoard,
  linkMultipleComponentsToBoard
};