import { supabase } from '../../lib/supabaseClient';
import { WIPS } from '../domain/wips';

// Haal alle WIPS op voor een specifieke userID
const getWipsByUserId = async (userId: number): Promise<WIPS[]> => {
  const { data, error } = await supabase
    .from('WIPS') 
    .select('*')
    .eq('userID', userId);

  if (error) {
    throw new Error(error.message);
  }

  return (data || []).map((item) => new WIPS(item));
};

export default {
  getWipsByUserId,
};
