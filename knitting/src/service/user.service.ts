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

const addUser = async (user: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<User> => {
  const { data, error } = await supabase
    .from('User')
    .insert([
      {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
    ])
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data as User;
};

const login = async (username: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('username', username)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  if (data.password !== password) return null;
  return data;
};


export default {
  getAllUsers,
  getUserByUsername,
  addUser,
  login,
};