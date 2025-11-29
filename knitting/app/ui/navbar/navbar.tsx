import { getCurrentUser } from '../../../lib/auth';
import NavbarClient from './navbarClient';

export default async function Navbar() {
  const user = await getCurrentUser();  
  return <NavbarClient user={user} />;
}