import { supabase } from '../../lib/supabaseClient';
import { User } from '../domain/user';

const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('User').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

const getUserByUsername = async (username: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('username', username)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const addUser = async (user: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<User> => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
  });
  if (authError || !authData.user) {
    throw new Error(`Register failed: ${authError?.message}`);
  }
  const { error: userError } = await supabase.from('users').insert([
    {
      id: authData.user.id,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
      learn_process: 0,
    },
  ]);
  if (userError) {
    throw new Error(`User creation failed: ${userError.message}`);
  }
  return new User({
    id: authData.user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: '',
    learnProcess: 0,
  });
};

export const login = async (email: string, password: string): Promise<String | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password,
  });
  if (error || !data.user) {
    console.error('Login failed:', error?.message);
    return null;
  }
  return data.user.id;
};

export default {
  getAllUsers,
  getUserByUsername,
  addUser,
  login,
};