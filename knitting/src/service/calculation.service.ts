import { supabase } from '../../lib/supabaseClient';
import { Calculation } from '../domain/calculation';

export const createCalculation = async (
  calculation: Omit<Calculation, 'calculationID' | 'created_at'>
): Promise<Calculation> => {
  const { data, error } = await supabase
    .from('Calculation')
    .insert([{
      calculationInputX: calculation.calculationInputX,
      calculationInputY: calculation.calculationInputY,
      calculationOutput: calculation.calculationOutput,
      calculationName: calculation.calculationName,
      userID: calculation.userID,
      wipID: calculation.wipID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export default {
  createCalculation,
};