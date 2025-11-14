import { getCurrentUser } from '../../lib/auth'; 
import CreatePageClient from './createPageClient';
import { getWIPSByUserID } from '../../src/service/wips.service';
import { WIPS } from '../../src/domain/wips';



export default async function Page() {
  const user = await getCurrentUser();

  let wipsData: WIPS[] = [];
  if (user?.id) { 
    wipsData = await getWIPSByUserID(user.id);
  }
  
  return <CreatePageClient user={user} wipsData={wipsData} />;
}