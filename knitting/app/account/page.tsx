import { getCurrentUser } from '../../lib/auth';
import { getUserWIPSAll } from "../../src/controller/wips.controller";
import AccountClient from "./accountPageClient";

export default async function Page() {
  const user = await getCurrentUser();
  const allWips = await getUserWIPSAll(user?.id);
  const finishedWips = allWips.filter((w: any) => w.wipFinished);
  return <AccountClient user={user} wips={finishedWips} />;
}