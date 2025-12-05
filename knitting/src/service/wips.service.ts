import { supabase } from '../../lib/supabaseClient';
import { WIPS } from '../domain/wips';
import { isURLUsedByVisionBoard } from './visionboard.service';

export const getWIPSByUserID = async (userID: string): Promise<WIPS[]> => {

  const { data, error } = await supabase
    .from('WIPS')
    .select('*')
    .eq('userID', userID)
    .eq('wipFinished', false)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export const getWIPSByUserIDAll = async (userID: string): Promise<WIPS[]> => {
  const { data, error } = await supabase
    .from('WIPS')
    .select('*')
    .eq('userID', userID)
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export const updateWIPMeasurements = async (
  wipID: number, 
  wipChestCircumference: number | null, 
  wipEase: number | null
): Promise<WIPS> => {
  const { data, error } = await supabase
    .from('WIPS')
    .update({ 
      wipChestCircumference,
      wipEase 
    })
    .eq('wipID', wipID)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const updateWIPSize = async (wipID: number, wipSize: string | null): Promise<WIPS> => {
  const { data, error } = await supabase
    .from('WIPS')
    .update({ wipSize })
    .eq('wipID', wipID)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const updateWIPCurrentPosition = async (wipID: number, wipCurrentPosition: string | null): Promise<WIPS> => {
  const { data, error } = await supabase
    .from('WIPS')
    .update({ wipCurrentPosition })
    .eq('wipID', wipID)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const getWIPSByWipID = async (wipID: number): Promise<WIPS[]> => {

  const { data, error } = await supabase
    .from('WIPS')
    .select('*')
    .eq('wipID', wipID)
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createWIP = async (wip: Omit<WIPS, 'wipID' | 'created_at'>): Promise<WIPS> => {
  const { data, error } = await supabase
    .from('WIPS')
    .insert([{
      wipName: wip.wipName,
      wipPictureURL: wip.wipPictureURL,
      wipBoardID: wip.wipBoardID,
      wipFinished: wip.wipFinished,
      wipCurrentPosition: wip.wipCurrentPosition,
      wipSize: wip.wipSize,
      wipChestCircumference: wip.wipChestCircumference,
      wipEase: wip.wipEase,
      userID: wip.userID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const finishWIP = async (wipID: number): Promise<WIPS> => {
  const { data, error } = await supabase
    .from('WIPS')
    .update({ wipFinished: true })
    .eq('wipID', wipID)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const uploadWIPImage = async (file: File, wipID: number, userID: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userID}/${wipID}-${Date.now()}.${fileExt}`;
    const filePath = `wip-images/${fileName}`;

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

export const deleteWIPImage = async (imageUrl: string): Promise<boolean> => {
  try {
    
    const parts = imageUrl.split('/knittingImages/');
    if (parts.length < 2 || !parts[1]) {
      console.error('Invalid URL format:', imageUrl);
      return false;
    }
    
    const filePath = parts[1]; 

    const { error } = await supabase.storage
      .from('knittingImages')
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    console.log('Successfully deleted');
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

export const updateWIPPicture = async (wipID: number, wipPictureURL: string | null): Promise<WIPS> => {
  const { data, error } = await supabase
    .from('WIPS')
    .update({ wipPictureURL })
    .eq('wipID', wipID)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteWIP = async (wipID: number): Promise<boolean> => {
  // Haal eerst de WIP op om de wipPictureURL te krijgen
  const wips = await getWIPSByWipID(wipID);
  
  if (!wips || wips.length === 0) {
    throw new Error('WIP not found');
  }
  
  const wip = wips[0];

  if(!wip) {
    throw new Error('WIP not found');
  }
  
  // Check of er een picture URL is en of deze niet van een VisionBoard komt
  if (wip.wipPictureURL) {
    try {
      const isUsedByVisionBoard = await isURLUsedByVisionBoard(wip.wipPictureURL);
      
      if (!isUsedByVisionBoard) {
        // URL wordt niet gebruikt door een VisionBoard, dus veilig om te deleten
        const deleteSuccess = await deleteWIPImage(wip.wipPictureURL);
        if (!deleteSuccess) {
          console.warn(`Failed to delete WIP image, but continuing with WIP deletion`);
        }
      } else {
        console.log(`Image not deleted - it's used by a VisionBoard`);
      }
    } catch (error) {
      console.error('Error checking VisionBoard usage, skipping image deletion:', error);
    }
  }
  
  // Delete de WIP uit de database 
  const { error } = await supabase
    .from('WIPS')
    .delete()
    .eq('wipID', wipID);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
};

export default {
  getWIPSByUserID,
  createWIP,
  getWIPSByWipID,
  updateWIPSize,
  updateWIPCurrentPosition,
  finishWIP,
  uploadWIPImage,
  deleteWIPImage,
  updateWIPPicture,
  updateWIPMeasurements,
  deleteWIP
};
