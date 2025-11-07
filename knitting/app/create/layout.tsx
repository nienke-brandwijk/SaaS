import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import ClientLayout from './clientLayout';

const JWT_SECRET = process.env.JWT_SECRET!;

export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value;

  if (!token) redirect('/login');

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    redirect('/login');
  }

  return <ClientLayout>{children}</ClientLayout>;
}