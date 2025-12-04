import { supabase } from '../../lib/supabaseClient';
import { ComponentData } from '../domain/component';
    
export const uploadComponentImageToStorage = async (
  userID: string,
  boardID: number,
  itemID: number,
  imageBuffer: Buffer
): Promise<string> => {
  // WIJZIGING: Voeg timestamp en random string toe voor uniciteit
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(7);
  const filePath = `vision-board-images/${userID}/component-${timestamp}-${randomStr}.png`;

  const { error: uploadError } = await supabase.storage
    .from('knittingImages') 
    .upload(filePath, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

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
  // 1. Haal component op
  const { data: component, error: fetchError } = await supabase
    .from('Component')
    .select('componentURL, componentType')
    .eq('componentID', componentID)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch component: ${fetchError.message}`);
  }

  // 2. Verwijder link
  const { error: linkError } = await supabase
    .from('VisionboardHasComponent')
    .delete()
    .eq('componentID', componentID);

  if (linkError) {
    throw new Error(`Failed to delete component link: ${linkError.message}`);
  }

  // 3. Check of er andere components zijn met dezelfde URL (voor images)
  let otherComponentsWithSameURL = null;
  if (component.componentType === 'image' && component.componentURL) {
    const { data, error: checkError } = await supabase
      .from('Component')
      .select('componentID')
      .eq('componentURL', component.componentURL)
      .eq('componentType', 'image')
      .neq('componentID', componentID);

    if (checkError) {
      console.error('Error checking for other components:', checkError);
    }
    otherComponentsWithSameURL = data;
  }

  let imagesWithSameURL = null;
  if (component.componentType === 'image' && component.componentURL) {
    const { data, error: imageCheckError } = await supabase
      .from('Image')
      .select('imageID')
      .eq('imageURL', component.componentURL);

    if (imageCheckError) {
      console.error('Error checking for images with same URL:', imageCheckError);
    }
    imagesWithSameURL = data;
  }

  // 4. Verwijder component record
  const { error: deleteError } = await supabase
    .from('Component')
    .delete()
    .eq('componentID', componentID);

  if (deleteError) {
    throw new Error(`Failed to delete component: ${deleteError.message}`);
  }

  // 5. Verwijder ALLEEN uit storage als:
  //    - Geen andere Component records deze URL gebruiken
  //    - EN geen Image records deze URL gebruiken
  if (component.componentType === 'image' && component.componentURL) {
    const isURLStillInUse = 
      (otherComponentsWithSameURL && otherComponentsWithSameURL.length > 0) ||
      (imagesWithSameURL && imagesWithSameURL.length > 0);

    if (!isURLStillInUse) {
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
          } else {
          }
        }
      } catch (e) {
        console.error('Error parsing component URL:', component.componentURL);
      }
    } else {
      const componentCount = otherComponentsWithSameURL?.length || 0;
      const imageCount = imagesWithSameURL?.length || 0;
      console.log(`ℹ️ Component image not deleted from storage - still in use by ${componentCount} other Component(s) and ${imageCount} Image record(s)`);
    }
  }

  return { success: true };
};

export default {
  createComponent,
  createMultipleComponents,
  linkComponentToBoard,
  linkMultipleComponentsToBoard
};