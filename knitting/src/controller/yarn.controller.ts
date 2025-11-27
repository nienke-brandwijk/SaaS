import { getYarnsByWipID, createYarn as createYarnService, deleteYarn as deleteYarnService} from '../service/yarn.service';

export const getWIPYarns = async (wipID: number) => {
  try {
    return await getYarnsByWipID(wipID);
  } catch (error) {
    console.error('Error fetching yarns:', error);
    return [];
  }
};

export const createWIPYarn = async (yarnName: string, yarnProducer: string, wipID: number) => {
  try {
    const newYarn = await createYarnService({
      yarnName,
      yarnProducer,
      yarnURL: '',
      yarnAmountNeeded: 0,
      yarnAmountUsed: 0,
      wipID
    });
    
    return newYarn;
  } catch (error) {
    console.error('Error creating yarn:', error);
    throw error;
  }
};

export const deleteWIPYarn = async (yarnID: number) => {
  try {
    await deleteYarnService(yarnID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting yarn:', error);
    throw error;
  }
};