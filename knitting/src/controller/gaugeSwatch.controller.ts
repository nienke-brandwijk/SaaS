import { getGaugeSwatchesByWipID } from '../service/gaugeSwatch.service';

export const getWIPGaugeSwatches = async (wipID: number) => {
  try {
    return await getGaugeSwatchesByWipID(wipID);
  } catch (error) {
    console.error('Error fetching gauge swatches:', error);
    return [];
  }
};