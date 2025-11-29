import { getCurrentUser } from '../../lib/auth';
import LoginClient from "./loginPageClient";

export default async function Page() {
  const user = await getCurrentUser();
  return <LoginClient user={user} />;
}