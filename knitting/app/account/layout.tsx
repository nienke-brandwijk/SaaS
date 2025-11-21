import { getCurrentUser } from '../../lib/auth';
import { getUserWIPS } from "../../src/controller/wips.controller";
import Page from './page';

export default async function Layout() {
  const user = await getCurrentUser();
  const allWips = await getUserWIPS(user?.id);
  const finishedWips = allWips.filter((w: any) => w.wipFinished);
  return <Page user={user} wips={finishedWips} />;
}
