import { supabase } from '../../lib/supabaseClient';
import { extraMaterials } from '../domain/extraMaterials';

export const getExtraMaterialsByWipID = async (wipID: number): Promise<extraMaterials[]> => {

  const { data, error } = await supabase
    .from('ExtraMaterials')
    .select('*')
    .eq('wipID', wipID);


  if (error) {
    throw new Error(error.message);
  }


  return data || [];
};

export default {
  getExtraMaterialsByWipID,
};