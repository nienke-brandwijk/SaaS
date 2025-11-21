import { getWIPDetailsByWipID } from '../service/wipDetails.service';
import { getWIPSByUserID } from '../service/wips.service';

export const getUserWIPDetails = async (userID: string) => {
  try {
    console.log("🔍 Fetching all WIP details for userID:", userID);
    
    // Haal eerst alle WIPs van de user op (plain objects)
    const wips = await getWIPSByUserID(userID);
    
    console.log("📦 Found", wips.length, "WIPs for user");
    
    // Voor elke WIP, haal alle details op (parallel)
    const wipDetailsPromises = wips.map(wip => 
      getWIPDetailsByWipID(wip.wipID!, wip)
    );
    
    const wipDetails = await Promise.all(wipDetailsPromises);
    
    console.log("✅ All WIP details fetched successfully");
    
    return wipDetails;
  } catch (error) {
    console.error('Error fetching user WIP details:', error);
    return [];
  }
};