import { supabase } from '../../lib/supabaseClient';
import { GaugeSwatch } from '../domain/gaugeSwatch';

export const getGaugeSwatchesByWipID = async (wipID: number): Promise<GaugeSwatch[]> => {

  const { data, error } = await supabase
    .from('GaugeSwatch')
    .select('*')
    .eq('wipID', wipID);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export default {
  getGaugeSwatchesByWipID,
};