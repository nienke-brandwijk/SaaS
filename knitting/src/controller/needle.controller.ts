import { getNeedlesByWipID } from '../service/needle.service';

export const getWIPNeedles = async (wipID: number) => {
  try {
    return await getNeedlesByWipID(wipID);
  } catch (error) {
    console.error('Error fetching needles:', error);
    return [];
  }
};