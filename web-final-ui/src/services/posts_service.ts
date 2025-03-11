import apiClient from "./api-client";
import { generatedPostText, getPostsResponse, Post } from "./intefaces/post";

const getPostById = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Post>(`/posts/${postId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

const getPosts = (page: number, limit:number) => {
    const abortController = new AbortController();
    const request = apiClient.get<getPostsResponse>(`/posts?page=${page}&limit=${limit}`, {
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

const generateTextFromImage = (image: File) => {
    const abortController = new AbortController();
    const formData = new FormData();
    formData.append("image", image);
    const request = apiClient.post<generatedPostText>(`/posts/generate`, formData,{
        signal: abortController.signal,
        headers: { "Content-Type": "multipart/form-data" },
    });
    return { request, abort: () => abortController.abort() };
};

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

const updatePost = (postId: string, image: File | null, content: string | null) => {
    const abortController = new AbortController();
    const formData = new FormData();
    if(image) formData.append("image", image);
    if(content) formData.append("content", content);

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
    generateTextFromImage
};
