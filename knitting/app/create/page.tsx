import { getCurrentUser } from '../../lib/auth'; 
import CreatePageClient from './createPageClient';
import { getWIPSByUserID } from '../../src/service/wips.service';
import { WIPS } from '../../src/domain/wips';
import { getUserWIPDetails } from '../../src/controller/wipDetails.controller';
import { WIPDetails } from '../../src/domain/wipDetails';
import { getPatternQueue } from '../../src/controller/PatternQueue.controller';
import { PatternQueue } from '../../src/domain/patternQueue';
import { getUserBoards } from '../../src/controller/visionboard.controller';
import { VisionBoard } from '../../src/domain/visionboard';
import { UserUsageData } from '../../src/domain/userUsage';
import { getUserUsage } from '../../src/controller/user.controller';

export default async function Page() {
  const user = await getCurrentUser();

  let wipsData: WIPS[] = [];
  let wipDetailsData: WIPDetails[] = [];
  let patternQueueData: PatternQueue[] = [];
  let visionBoardsData: VisionBoard[] = [];
  let userUsageData: UserUsageData | null = null;

  if (user?.id) { 
    wipsData = await getWIPSByUserID(user.id);
    wipDetailsData = await getUserWIPDetails(user.id);
    patternQueueData = await getPatternQueue(user.id);
    visionBoardsData = await getUserBoards(user.id);
    userUsageData = await getUserUsage(user.id);
  }
  
   return (
    <CreatePageClient 
      user={user} 
      wipsData={wipsData} 
      wipDetailsData={wipDetailsData} 
      patternQueueData={patternQueueData} 
      visionBoardsData={visionBoardsData}
      userUsageData={userUsageData}
    />
  );
}