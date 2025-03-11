import apiClient from "./api-client";
import { User } from "./intefaces/user";

const getUserProfile = (userId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<User>(`/users/profile/${userId}`, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

const addUserPhoto = (userId: string, photo: File) => {
    const abortController = new AbortController();
    const formData = new FormData();
    formData.append("photo", photo);

    const request = apiClient.put<User>(`/users/${userId}/photo`, formData, {
        signal: abortController.signal,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return { request, abort: () => abortController.abort() };
};

const updateUserName = (username: string) => {
    const abortController = new AbortController();
    const request = apiClient.put<User>(
        "/users/userName",
        { username },
        { signal: abortController.signal }
    );

    return { request, abort: () => abortController.abort() };
};

export default { getUserProfile, addUserPhoto, updateUserName };
