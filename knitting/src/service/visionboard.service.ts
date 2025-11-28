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

export const createVisionBoard = async (
  boardName: string,
  userID: string,
  boardHeight: number | null = null,
  boardWidth: number | null = null
): Promise<VisionBoard> => {
  const { data, error } = await supabase
    .from('Visionboard')
    .insert([
      {
        boardName,
        userID,
        boardHeight,
        boardWidth,
        boardURL: '', // voorlopig leeg, wordt later gevuld
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export default {
  getBoardsByUserID,
  createVisionBoard
};