import { getCurrentUser } from '../../lib/auth';
import { getUserWIPS } from "../../src/controller/wips.controller";
import AccountClient from "./accountPageClient";

export default async function Page() {
  const user = await getCurrentUser();
  const allWips = await getUserWIPS(user?.id);
  const finishedWips = allWips.filter((w: any) => w.wipFinished);

  return <AccountClient user={user} wips={finishedWips} />;
}