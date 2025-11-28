import {
  createComponent,
  createMultipleComponents,
  linkComponentToBoard,
  linkMultipleComponentsToBoard,
  uploadComponentImageToStorage
} from '../service/component.service';
import { ComponentData } from '../domain/component';


type ComponentImagePayload = {
  userID: string;
  boardID: number;
  itemID: number;
  imageBuffer: Buffer; // Niet meer dataUrl, maar Buffer
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