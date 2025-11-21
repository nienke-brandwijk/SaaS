import { getWIPNeedles } from '../controller/needle.controller';
import { getWIPGaugeSwatches } from '../controller/gaugeSwatch.controller';
import { getWIPYarns } from '../controller/yarn.controller';
import { getWIPExtraMaterials } from '../controller/extraMaterials.controller';

export const getWIPDetailsByWipID = async (wipID: number, wip: any) => {
  console.log("🔍 Fetching all details for wipID:", wipID);

  // Haal alle gerelateerde data parallel op voor betere performance
  const [needles, gaugeSwatches, yarns, extraMaterials] = await Promise.all([
    getWIPNeedles(wipID),
    getWIPGaugeSwatches(wipID),
    getWIPYarns(wipID),
    getWIPExtraMaterials(wipID)
  ]);

  console.log("✅ All details fetched for wipID:", wipID);

  // Return plain object in plaats van class instance
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