import { getBoardsByUserID, createVisionBoard as createVisionBoardService, getBoardByID, deleteVisionBoard as deleteVisionBoardService, updateVisionBoardTitle as updateVisionBoardTitleService,
  updateVisionBoardURL as updateVisionBoardURLService, deleteOldBoardScreenshot as deleteOldBoardScreenshotService
 } from '../service/visionboard.service';
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

export const updateVisionBoardTitle = async (
  boardID: number,
  boardName: string
) => {
  try {
    const updatedBoard = await updateVisionBoardTitleService(boardID, boardName);
    return updatedBoard;
  } catch (error) {
    console.error('Error updating vision board title:', error);
    throw error;
  }
};

export const updateVisionBoardURL = async (
  boardID: number,
  boardURL: string
) => {
  try {
    const updatedBoard = await updateVisionBoardURLService(boardID, boardURL);
    return updatedBoard;
  } catch (error) {
    console.error('Error updating vision board URL:', error);
    throw error;
  }
};

export const deleteOldBoardScreenshot = async (boardURL: string) => {
  try {
    await deleteOldBoardScreenshotService(boardURL);
    return { success: true };
  } catch (error) {
    console.error('Error deleting old board screenshot:', error);
    throw error;
  }
};