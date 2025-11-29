import { getCommentsByWipID, createComment as createCommentService, deleteComment as deleteCommentService } from '../service/comment.service';

export const getWIPComments = async (wipID: number) => {
  try {
    return await getCommentsByWipID(wipID);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const createWIPComment = async (commentContent: string, wipID: number) => {
  try {
    const newComment = await createCommentService({
      commentContent,
      wipID
    });
    
    return newComment;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const deleteWIPComment = async (commentID: number) => {
  try {
    await deleteCommentService(commentID);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};