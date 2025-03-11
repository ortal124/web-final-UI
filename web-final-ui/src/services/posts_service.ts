import apiClient from "./api-client";
import { Post } from "./intefaces/post";

const getPostById = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Post>(`/posts/${postId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

const getPosts = () => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>("/posts", {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

const getPostsByUserId = (userId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>(`/posts/user/${userId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

// קריאה להוספת פוסט
const createPost = (image: File, content: string) => {
    const abortController = new AbortController();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", content);

    const request = apiClient.post<Post>("/posts", formData, {
        signal: abortController.signal,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return { request, abort: () => abortController.abort() };
};

const updatePost = (postId: string, image: File, content: string) => {
    const abortController = new AbortController();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", content);

    const request = apiClient.put<Post>(`/posts/${postId}`, formData, {
        signal: abortController.signal,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return { request, abort: () => abortController.abort() };
};

const deletePost = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/posts/${postId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

const likePost = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.post(`/posts/${postId}/like`, {}, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

const unLikePost = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/posts/${postId}/like`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

export default {
    getPostById,
    getPosts,
    getPostsByUserId,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unLikePost,
};
