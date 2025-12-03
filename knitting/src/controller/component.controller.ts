import {
  createComponent,
  createMultipleComponents,
  linkComponentToBoard,
  linkMultipleComponentsToBoard,
  uploadComponentImageToStorage,
  getComponentsByBoardID,
  updateComponentPosition,
  updateMultipleComponentPositions,
  deleteComponent as deleteComponentService
} from '../service/component.service';
import { ComponentData } from '../domain/component';


type ComponentImagePayload = {
  userID: string;
  boardID: number;
  itemID: number;
  imageBuffer: Buffer; 
};

export const deleteComponent = async (componentID: number) => {
  try {
    await deleteComponentService(componentID);
    return { success: true };
  } catch (error) {
    console.error('Controller error deleting component:', error);
    throw error;
  }
};

export const updateComponentPositions = async (
  updates: Array<{
    componentID: number;
    positionX: number;
    positionY: number;
    rotation?: number;
  }>
) => {
  try {
    const updatedComponents = await updateMultipleComponentPositions(updates);
    return updatedComponents;
  } catch (error) {
    console.error('Controller error updating component positions:', error);
    throw error;
  }
};

export const componentImageController = async (
  payload: ComponentImagePayload
): Promise<string> => {
  const { userID, boardID, itemID, imageBuffer } = payload;

  if (!userID) throw new Error('userID is required');
  if (!boardID) throw new Error('boardID is required');
  if (!itemID) throw new Error('itemID is required');
  if (!imageBuffer) throw new Error('imageBuffer is required');

  const imageURL = await uploadComponentImageToStorage(userID, boardID, itemID, imageBuffer);
  return imageURL;
};

export const getBoardComponents = async (boardID: number) => {
  try {
    const components = await getComponentsByBoardID(boardID);
    return components;
  } catch (error) {
    console.error('Error fetching components:', error);
    throw error;
  }
};

export const createAndLinkComponent = async (
  componentData: ComponentData,
  boardID: number
) => {
  try {
    // 1. Create the component
    const newComponent = await createComponent(componentData);
    
    // 2. Link it to the board
    await linkComponentToBoard(newComponent.componentID, boardID);
    
    return newComponent;
  } catch (error) {
    console.error('Controller error creating and linking component:', error);
    throw error;
  }
};


export const createAndLinkMultipleComponents = async (
  components: ComponentData[],
  boardID: number
) => {
  try {
    // 1. Create all components
    const newComponents = await createMultipleComponents(components);
    
    // 2. Extract their IDs
    const componentIDs = newComponents.map((c: any) => c.componentID);
    
    // 3. Link them all to the board
    await linkMultipleComponentsToBoard(componentIDs, boardID);
    
    return newComponents;
  } catch (error) {
    console.error('Controller error creating and linking multiple components:', error);
    throw error;
  }
};

export default {
  createAndLinkComponent,
  createAndLinkMultipleComponents
};