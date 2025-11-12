import { getCurrentUser } from '../../lib/auth'; 
import CreatePageClient from './createPageClient';


export default async function Page() {
  const user = await getCurrentUser();
  
  return <CreatePageClient user={user} />;
}