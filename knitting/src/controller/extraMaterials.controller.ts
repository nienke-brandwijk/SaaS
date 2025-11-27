import { getExtraMaterialsByWipID, createExtraMaterial as createExtraMaterialService, deleteExtraMaterial as deleteExtraMaterialService } from '../service/extraMaterials.service';

export const getWIPExtraMaterials = async (wipID: number) => {
  try {
    return await getExtraMaterialsByWipID(wipID);
  } catch (error) {
    console.error('Error fetching extra materials:', error);
    return [];
  }
};

export const createWIPExtraMaterial = async (extraMaterialsDescription: string, wipID: number) => {
  try {
    const newExtraMaterial = await createExtraMaterialService({
      extraMaterialsDescription,
      wipID
    });
    
    return newExtraMaterial;
  } catch (error) {
    console.error('Error creating extra material:', error);
    throw error;
  }
};

export const deleteWIPExtraMaterial = async (extraMaterialsID: number) => {
  try {
    await deleteExtraMaterialService(extraMaterialsID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting extra material:', error);
    throw error;
  }
};