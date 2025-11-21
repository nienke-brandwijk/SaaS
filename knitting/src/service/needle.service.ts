import { supabase } from '../../lib/supabaseClient';
import { Needle } from '../domain/needle';

export const getNeedlesByWipID = async (wipID: number): Promise<Needle[]> => {

  const { data, error } = await supabase
    .from('Needle')
    .select('*')
    .eq('wipID', wipID);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const createNeedle = async (needle: Omit<Needle, 'needleID'>): Promise<Needle> => {
  const { data, error } = await supabase
    .from('Needle')
    .insert([{
      needleSize: needle.needleSize,
      needlePart: needle.needlePart,
      wipID: needle.wipID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteNeedle = async (needleID: number): Promise<void> => {
  const { error } = await supabase
    .from('Needle')
    .delete()
    .eq('needleID', needleID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export default {
  getNeedlesByWipID,
  createNeedle,
  deleteNeedle,
};