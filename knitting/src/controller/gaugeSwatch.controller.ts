import { getGaugeSwatchesByWipID, createGaugeSwatch as createGaugeSwatchService, deleteGaugeSwatch as deleteGaugeSwatchService } from '../service/gaugeSwatch.service';

export const getWIPGaugeSwatches = async (wipID: number) => {
  try {
    return await getGaugeSwatchesByWipID(wipID);
  } catch (error) {
    console.error('Error fetching gauge swatches:', error);
    return [];
  }
};

export const createWIPGaugeSwatch = async (gaugeStitches: number, gaugeRows: number, gaugeDescription: string, wipID: number) => {
  try {
    const newGaugeSwatch = await createGaugeSwatchService({
      gaugeStitches,
      gaugeRows,
      gaugeDescription,
      wipID
    });
    
    return newGaugeSwatch;
  } catch (error) {
    console.error('Error creating gauge swatch:', error);
    throw error;
  }
};

export const deleteWIPGaugeSwatch = async (gaugeID: number) => {
  try {
    await deleteGaugeSwatchService(gaugeID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting gauge swatch:', error);
    throw error;
  }
};