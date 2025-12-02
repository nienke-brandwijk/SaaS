import { getBoardsByUserID, createVisionBoard as createVisionBoardService, getBoardByID, deleteVisionBoard as deleteVisionBoardService } from '../service/visionboard.service';
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

export const deleteVisionBoard = async (boardID: number) => {
  try {
    await deleteVisionBoardService(boardID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting vision board:', error);
    throw error;
  }
};

export const getVisionBoardByID = async (boardID: number) => {
  try {
    const board = await getBoardByID(boardID);
    return board;
  } catch (error) {
    console.error('Error fetching vision board:', error);
    throw error;
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
      boardData.boardWidth,
      boardData.boardURL
    );
    return newBoard;
  } catch (error) {
    console.error('Error creating vision board:', error);
    throw error;
  }
};