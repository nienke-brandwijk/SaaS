import { getYarnsByWipID } from '../service/yarn.service';

export const getWIPYarns = async (wipID: number) => {
  try {
    return await getYarnsByWipID(wipID);
  } catch (error) {
    console.error('Error fetching yarns:', error);
    return [];
  }
};