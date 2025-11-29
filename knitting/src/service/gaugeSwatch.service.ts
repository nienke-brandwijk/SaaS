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

export const createGaugeSwatch = async (gaugeSwatch: Omit<GaugeSwatch, 'gaugeID'>): Promise<GaugeSwatch> => {
  const { data, error } = await supabase
    .from('GaugeSwatch')
    .insert([{
      gaugeStitches: gaugeSwatch.gaugeStitches,
      gaugeRows: gaugeSwatch.gaugeRows,
      gaugeDescription: gaugeSwatch.gaugeDescription,
      wipID: gaugeSwatch.wipID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteGaugeSwatch = async (gaugeID: number): Promise<void> => {
  const { error } = await supabase
    .from('GaugeSwatch')
    .delete()
    .eq('gaugeID', gaugeID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export default {
  getGaugeSwatchesByWipID,
  createGaugeSwatch,
  deleteGaugeSwatch,
};