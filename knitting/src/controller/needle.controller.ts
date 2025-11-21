import { getNeedlesByWipID, createNeedle as createNeedleService, deleteNeedle as deleteNeedleService } from '../service/needle.service';

export const getWIPNeedles = async (wipID: number) => {
  try {
    return await getNeedlesByWipID(wipID);
  } catch (error) {
    console.error('Error fetching needles:', error);
    return [];
  }
};

export const createWIPNeedle = async (needleSize: string, needlePart: string, wipID: number) => {
  try {
    const newNeedle = await createNeedleService({
      needleSize,
      needlePart,
      wipID
    });
    
    return newNeedle;
  } catch (error) {
    console.error('Error creating needle:', error);
    throw error;
  }
};

export const deleteWIPNeedle = async (needleID: number) => {
  try {
    await deleteNeedleService(needleID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting needle:', error);
    throw error;
  }
};