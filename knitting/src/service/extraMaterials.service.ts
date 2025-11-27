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

export const createExtraMaterial = async (extraMaterial: Omit<extraMaterials, 'extraMaterialsID'>): Promise<extraMaterials> => {
  const { data, error } = await supabase
    .from('ExtraMaterials')
    .insert([{
      extraMaterialsDescription: extraMaterial.extraMaterialsDescription,
      wipID: extraMaterial.wipID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteExtraMaterial = async (extraMaterialsID: number): Promise<void> => {
  const { error } = await supabase
    .from('ExtraMaterials')
    .delete()
    .eq('extraMaterialsID', extraMaterialsID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export default {
  getExtraMaterialsByWipID,
  createExtraMaterial,
  deleteExtraMaterial,
};