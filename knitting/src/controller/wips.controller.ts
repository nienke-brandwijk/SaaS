import { getWIPSByUserID, createWIP as createWIPService, getWIPSByWipID, updateWIPSize as updateWIPSizeService, updateWIPCurrentPosition as updateWIPCurrentPositionService, finishWIP as finishWIPService, uploadWIPImage as uploadWIPImageService, deleteWIPImage as deleteWIPImageService, updateWIPPicture as updateWIPPictureService } from '../service/wips.service';import { WIPS } from '../domain/wips';

export const getUserWIPS = async (userID: string) => {
  try {
    const wips = await getWIPSByUserID(userID);
    return wips;
  } catch (error) {
    console.error('Error fetching user WIPS:', error);
    return [];
  }
};

export const finishWIP = async (wipID: number) => {
  try {
    const updatedWIP = await finishWIPService(wipID);
    return updatedWIP;
  } catch (error) {
    console.error('Error finishing WIP:', error);
    throw error;
  }
};

export const getCurrentWIP = async (wipID: number) => {
  try {
    const wips = await getWIPSByWipID(wipID);
    return wips;
  } catch (error) {
    console.error('Error fetching user WIPS:', error);
    return [];
  }
};

export const updateWIPSize = async (wipID: number, wipSize: string | null) => {
  try {
    const updatedWIP = await updateWIPSizeService(wipID, wipSize);
    return updatedWIP;
  } catch (error) {
    console.error('Error updating WIP size:', error);
    throw error;
  }
};

export const updateWIPCurrentPosition = async (wipID: number, wipCurrentPosition: string | null) => {
  try {
    const updatedWIP = await updateWIPCurrentPositionService(wipID, wipCurrentPosition);
    return updatedWIP;
  } catch (error) {
    console.error('Error updating WIP current position:', error);
    throw error;
  }
};


export const createWIPFromPattern = async (patternName: string, userID: string) => {
  try {
    const newWIP = await createWIPService({
      wipName: patternName,
      wipPictureURL: null,
      wipBoardID: null, 
      wipFinished: false,
      wipCurrentPosition: 'Just started',
      wipSize: null,
      wipChestCircumference: null,
      wipEase: null,
      userID
    });
    
    return newWIP;
  } catch (error) {
    console.error('Error creating WIP from pattern:', error);
    throw error;
  }
};

export const uploadWIPImage = async (file: File, wipID: number, userID: string) => {
  try {
    return await uploadWIPImageService(file, wipID, userID);
  } catch (error) {
    console.error('Error uploading WIP image:', error);
    throw error;
  }
};

export const deleteWIPImage = async (imageUrl: string) => {
  try {
    return await deleteWIPImageService(imageUrl);
  } catch (error) {
    console.error('Error deleting WIP image:', error);
    throw error;
  }
};

export const updateWIPPicture = async (wipID: number, wipPictureURL: string | null) => {
  try {
    return await updateWIPPictureService(wipID, wipPictureURL);
  } catch (error) {
    console.error('Error updating WIP picture:', error);
    throw error;
  }
};

