import { supabase } from '../../lib/supabaseClient';
import { WIPS } from '../domain/wips';

export const getWIPSByUserID = async (userID: string): Promise<WIPS[]> => {
  const { data, error } = await supabase
    .from('WIPS')
    .select('*')
    .eq('userID', userID)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return (data || []).map(row => new WIPS({
    wipID: row.wipID,
    created_at: row.created_at,
    wipName: row.wipName,
    wipPictureURL: row.wipPictureURL,
    wipBoardID: row.wipBoardID,
    wipFinished: row.wipFinished,
    wipCurrentPosition: row.wipCurrentPosition,
    wipSize: row.wipSize,
    wipChestCircumference: row.wipChestCircumference,
    wipEase: row.wipEase,
    userID: row.userID
  }));
};

export default {
  getWIPSByUserID,
};
