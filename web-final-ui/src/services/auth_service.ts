import apiClient from "./api-client";
import { User } from "./intefaces/user";
import { AuthData } from "./intefaces/auth";

const register = (user: FormData) => {
    const abortController = new AbortController()
    const request = apiClient.post<AuthData>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const login = (user: Partial<User>) => {
    const abortController = new AbortController()
    const request = apiClient.post<AuthData>('/auth/login',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const refresh = (refreshToken: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<AuthData>('/auth/refresh',
        { refreshToken },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const logout = (refreshToken: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<void>('/auth/logout',
        { refreshToken },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const googleSignIn = (credential: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<AuthData>('/auth/google/login',
        { credential },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const googleSignUp = (credential: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<AuthData>('/auth/google/register',
        { credential },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

export default { register, login, refresh, logout, googleSignIn, googleSignUp }