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

export const getCalculationsByUserID = async (userID: string): Promise<Calculation[]> => {
  const { data, error } = await supabase
    .from('Calculation')
    .select('*')
    .eq('userID', userID)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data || [];
};

export const deleteCalculation = async (calculationID: number): Promise<void> => {
  const { error } = await supabase
    .from('Calculation')
    .delete()
    .eq('calculationID', calculationID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export const deleteAllCalculationsByUserID = async (userID: string): Promise<void> => {
  const { error } = await supabase
    .from('Calculation')
    .delete()
    .eq('userID', userID);

  if (error) {
    throw new Error(error.message);
  }
};

export const updateCalculationWipID = async (
  calculationID: number, 
  wipID: number
): Promise<Calculation> => {
  const { data, error } = await supabase
    .from('Calculation')
    .update({ wipID: wipID })
    .eq('calculationID', calculationID)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export default {
  createCalculation,
  getCalculationsByUserID,
  deleteCalculation,
  deleteAllCalculationsByUserID,
  updateCalculationWipID
};