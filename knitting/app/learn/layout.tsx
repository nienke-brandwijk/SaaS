import ClientLayout from './learnPageClient';
import { getCurrentUser } from '../../lib/auth';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  console.log("User in client:", user);
  return <ClientLayout user={user}>{children}</ClientLayout>;
}
