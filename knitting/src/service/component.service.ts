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

export default {
  createComponent,
  createMultipleComponents,
  linkComponentToBoard,
  linkMultipleComponentsToBoard
};