import { supabase } from '../../lib/supabaseClient';
import { WIPS } from '../domain/wips';

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
    const urlParts = imageUrl.split('/knittingImages/');
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];

    if (!filePath) {
      return false;
    }

    const { error } = await supabase.storage
      .from('knittingImages')
      .remove([filePath]);

    if (error) {
      throw error;
    }

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

export default {
  getWIPSByUserID,
  createWIP,
  getWIPSByWipID,
  updateWIPSize,
  updateWIPCurrentPosition,
  finishWIP,
  uploadWIPImage,
  deleteWIPImage,
  updateWIPPicture
};
