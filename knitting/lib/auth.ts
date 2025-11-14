import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';
import { redirect } from 'react-router-dom';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getCurrentUser() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/login');
    return null;
  }
  if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  const secret = JWT_SECRET as string;
  let session: { id: number; email: string } | null = null;
  session = jwt.verify(token, secret) as unknown as {
    id: number;
    email: string;
  };
  if (!session) redirect('/login');
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.id)
    .single();
  if (error || !data) redirect('/login');
  return data;
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}