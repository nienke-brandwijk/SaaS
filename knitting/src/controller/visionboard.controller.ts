import { getBoardsByUserID } from '../service/visionboard.service';
import { VisionBoard } from '../domain/visionboard';

export const getUserBoards = async (userID: string) => {
  try {
    const wips = await getBoardsByUserID(userID);
    return wips;
  } catch (error) {
    console.error('Error fetching user WIPS:', error);
    return [];
  }
};