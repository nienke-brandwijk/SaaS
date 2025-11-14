import { getWIPSByUserID } from '../service/wips.service';

export const getUserWIPS = async (userID: string) => {
  try {
    const wips = await getWIPSByUserID(userID);
    return wips;
  } catch (error) {
    console.error('Error fetching user WIPS:', error);
    return [];
  }
};

