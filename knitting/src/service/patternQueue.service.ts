import { get } from 'http';
import { supabase } from '../../lib/supabaseClient';
import { PatternQueue } from '../domain/patternQueue';

export const getQueueByUserID = async (userID: string): Promise<PatternQueue[]> => {

  const { data, error } = await supabase
    .from('PatternQueue')
    .select('*')
    .eq('userID', userID);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export const createPatternQueue = async (patternQueue: Omit<PatternQueue, 'patternQueueID'>): Promise<PatternQueue> => {
  const { data, error } = await supabase
    .from('PatternQueue')
    .insert([{
      patternName: patternQueue.patternName,
      patternLink: patternQueue.patternLink,
      patternPosition: patternQueue.patternPosition,
      userID: patternQueue.userID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deletePatternQueue = async (patternQueueID: number): Promise<void> => {
  const { error } = await supabase
    .from('PatternQueue')
    .delete()
    .eq('patternQueueID', patternQueueID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export default {
  getQueueByUserID,
  createPatternQueue,
  deletePatternQueue,
};
