import { getCurrentUser } from '../../lib/auth'; 
import CreatePageClient from './createPageClient';
import { getWIPSByUserID } from '../../src/service/wips.service';
import { WIPS } from '../../src/domain/wips';
import { getUserWIPDetails } from '../../src/controller/wipDetails.controller';
import { WIPDetails } from '../../src/domain/wipDetails';
import { getPatternQueue } from '../../src/controller/PatternQueue.controller';
import { PatternQueue } from '../../src/domain/patternQueue';
import { getBoardsByUserID } from '../../src/service/visionboard.service';
import { VisionBoard } from '../../src/domain/visionboard';




export default async function Page() {
  const user = await getCurrentUser();

  let wipsData: WIPS[] = [];
  let wipDetailsData: WIPDetails[] = [];
  let patternQueueData: PatternQueue[] = [];
  let visionBoardsData: VisionBoard[] = [];

  if (user?.id) { 
    wipsData = await getWIPSByUserID(user.id);
    wipDetailsData = await getUserWIPDetails(user.id);
    patternQueueData = await getPatternQueue(user.id);
    visionBoardsData = await getBoardsByUserID(user.id);
  }
  
   return (
    <CreatePageClient 
      user={user} 
      wipsData={wipsData} 
      wipDetailsData={wipDetailsData} 
      patternQueueData={patternQueueData} 
      visionBoardsData={visionBoardsData}
    />
  );
}