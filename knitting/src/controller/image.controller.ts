import { uploadImage as uploadImageService, createImage as createImageService, linkImageToBoard } from '../service/image.service';
import { Image } from '../domain/image';

export const uploadAndLinkImage = async (
  file: File,
  userID: string,
  imageHeight: number,
  imageWidth: number,
  boardID: number  
): Promise<Image | null> => {
  try {
    const imageURL = await uploadImageService(file, userID);
    
    if (!imageURL) {
      throw new Error('Failed to upload image');
    }

    const newImage = await createImageService(imageURL, imageHeight, imageWidth);
    
    await linkImageToBoard(newImage.imageID, boardID);
    
    return newImage;
  } catch (error) {
    console.error('Error uploading and linking image:', error);
    throw error;
  }
};