import { supabase } from '../../lib/supabaseClient';
import { User } from '../domain/user';

const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('User').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export default {
  getAllUsers,
};
