import { supabase } from '../../lib/supabaseClient';
import { Comment } from '../domain/comment';

export const getCommentsByWipID = async (wipID: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('Comment')
    .select('*')
    .eq('wipID', wipID)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const createComment = async (comment: Omit<Comment, 'commentID' | 'created_at'>): Promise<Comment> => {
  const { data, error } = await supabase
    .from('Comment')
    .insert([{
      commentContent: comment.commentContent,
      wipID: comment.wipID
    }])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteComment = async (commentID: number): Promise<void> => {
  const { error } = await supabase
    .from('Comment')
    .delete()
    .eq('commentID', commentID);
  
  if (error) {
    throw new Error(error.message);
  }
};

export default {
  getCommentsByWipID,
  createComment,
  deleteComment,
};