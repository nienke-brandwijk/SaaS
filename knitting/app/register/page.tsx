import { getCurrentUser } from '../../lib/auth';
import RegisterClient from "./registerPageClient";

export default async function Page() {
  const user = await getCurrentUser();
  return <RegisterClient user={user} />;
}