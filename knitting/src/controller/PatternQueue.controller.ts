import { getQueueByUserID } from '../service/patternQueue.service';
import { createPatternQueue as createQueueService, deletePatternQueue as deleteQueueService, updatePatternPositions as updatePositionsService} from '../service/patternQueue.service';


export const getPatternQueue = async (userID: string) => {
  try {
    return await getQueueByUserID(userID);
  } catch (error) {
    console.error('Error fetching needles:', error);
    return [];
  }
};

export const createPatternQueue = async (
  patternName: string, 
  patternLink: string, 
  patternPosition: number,
  userID: string
) => {
  try {
    const newPattern = await createQueueService({
      patternName,
      patternLink,
      patternPosition,
      userID
    });
    
    return newPattern;
  } catch (error) {
    console.error('Error creating pattern queue:', error);
    throw error;
  }
};

export const deletePatternQueue = async (patternQueueID: number) => {
  try {
    await deleteQueueService(patternQueueID);
  } catch (error) {
    console.error('Error deleting pattern queue:', error);
    throw error;
  }
};

export const updatePatternPositions = async (updates: { patternQueueID: number, patternPosition: number }[]) => {
  try {
    await updatePositionsService(updates);
  } catch (error) {
    console.error('Error updating pattern positions:', error);
    throw error;
  }
};