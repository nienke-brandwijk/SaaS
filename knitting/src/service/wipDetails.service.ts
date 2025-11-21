import { getWIPNeedles } from '../controller/needle.controller';
import { getWIPGaugeSwatches } from '../controller/gaugeSwatch.controller';
import { getWIPYarns } from '../controller/yarn.controller';
import { getWIPExtraMaterials } from '../controller/extraMaterials.controller';

export const getWIPDetailsByWipID = async (wipID: number, wip: any) => {

  const [needles, gaugeSwatches, yarns, extraMaterials] = await Promise.all([
    getWIPNeedles(wipID),
    getWIPGaugeSwatches(wipID),
    getWIPYarns(wipID),
    getWIPExtraMaterials(wipID)
  ]);

  return {
    ...wip,
    needles,
    gaugeSwatches,
    yarns,
    extraMaterials
  };
};

export default {
  getWIPDetailsByWipID,
};