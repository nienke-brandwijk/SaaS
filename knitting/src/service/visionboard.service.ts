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

  console.log("✅ Number of Visionboards found:", data?.length);
  
  return data || [];
};