import { getCurrentUser } from '../../../lib/auth';
import NavbarClient from './navbarClient';

export default async function Navbar() {
  const user = await getCurrentUser();
  console.log("User from getCurrentUser:", user); // Debug log
  
  return <NavbarClient user={user} />;
}