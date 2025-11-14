import { cookies } from 'next/headers';
import { supabase } from './supabaseClient';

export async function getCurrentUser() {
  const cookieStore = cookies();
  const username = (await cookieStore).get('user_session')?.value;
  
  if (!username) return null;
  
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) return null;
  
  return data;
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}