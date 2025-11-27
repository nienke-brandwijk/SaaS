import { supabase } from '../../lib/supabaseClient';
import { Needle } from '../domain/needle';

export const getNeedlesByWipID = async (wipID: number): Promise<Needle[]> => {
  console.log(`[getNeedlesByWipID] Fetching needles for wipID: ${wipID}`);

  const { data, error } = await supabase
    .from('Needle')
    .select('*')
    .eq('wipID', wipID);

  if (error) {
    throw new Error(error.message);
  }
  console.log(`[getNeedlesByWipID] Raw data from Supabase:`, data);

  return data || [];
};

export default {
  getNeedlesByWipID,
};