import { supabase } from '../../lib/supabaseClient';
import { Yarn } from '../domain/yarn';

export const getYarnsByWipID = async (wipID: number): Promise<Yarn[]> => {

  const { data, error } = await supabase
    .from('Yarn')
    .select('*')
    .eq('wipID', wipID);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const createYarn = async (yarn: Omit<Yarn, 'yarnID'>): Promise<Yarn> => {
  const { data, error } = await supabase
    .from('Yarn')
    .insert([{
      yarnName: yarn.yarnName,
      yarnProducer: yarn.yarnProducer,
      wipID: yarn.wipID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteYarn = async (yarnID: number): Promise<void> => {
  const { error } = await supabase
    .from('Yarn')
    .delete()
    .eq('yarnID', yarnID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export default {
  getYarnsByWipID,
  createYarn,
  deleteYarn,
};