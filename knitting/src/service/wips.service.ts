import { supabase } from '../../lib/supabaseClient';
import { WIPS } from '../domain/wips';

export const getWIPSByUserID = async (userID: string): Promise<WIPS[]> => {
  console.log("🔍 Fetching WIPS for userID:", userID);

  const { data, error } = await supabase
    .from('WIPS')
    .select('*')
    .eq('userID', userID)
    .order('created_at', { ascending: false });

    console.log("📦 Raw data from Supabase:", data);
  
  if (error) {
    throw new Error(error.message);
  }

  console.log("✅ Number of WIPS found:", data?.length);
  
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

export default {
  getWIPSByUserID,
  createWIP,
};
