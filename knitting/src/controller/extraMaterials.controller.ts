import { getExtraMaterialsByWipID } from '../service/extraMaterials.service';

export const getWIPExtraMaterials = async (wipID: number) => {
  try {
    return await getExtraMaterialsByWipID(wipID);
  } catch (error) {
    console.error('Error fetching extra materials:', error);
    return [];
  }
};