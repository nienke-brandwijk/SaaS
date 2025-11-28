import { getBoardsByUserID, createVisionBoard as createVisionBoardService } from '../service/visionboard.service';
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

export const createNewVisionBoard = async (
  boardData: Omit<VisionBoard, 'boardID'>
) => {
  try {
    const newBoard = await createVisionBoardService(
      boardData.boardName,
      boardData.userID,
      boardData.boardHeight,
      boardData.boardWidth
    );
    return newBoard;
  } catch (error) {
    console.error('Error creating vision board:', error);
    throw error;
  }
};