import apiClient from "./api-client";
import { Comment } from "./intefaces/comment";

// Function to get comments for a specific post
const getCommentsByPostId = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Comment[]>(`/comments/${postId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

// Function to add a new comment
const addComment = (postId: string, content: string) => {
    const abortController = new AbortController();
    const request = apiClient.post("/comments", { postId, content }, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

// Function to delete a comment
const deleteComment = (commentId: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/comments/${commentId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

export default {
    getCommentsByPostId,
    addComment,
    deleteComment
};