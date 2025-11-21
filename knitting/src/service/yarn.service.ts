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

export default {
  getYarnsByWipID,
};