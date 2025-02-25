import apiClient, { CanceledError } from "./api-client";
import { User } from "./intefaces/user";

export { CanceledError }

const register = (user: FormData) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/register',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const login = (user: User) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/login',
        user,
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const refresh = (refreshToken: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/refresh',
        { refreshToken },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const logout = (refreshToken: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/logout',
        { refreshToken },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

const googleSignIn = (credential: string) => {
    const abortController = new AbortController()
    const request = apiClient.post<User>('/auth/google/login',
        { credential },
        { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

export default { register, login, refresh, logout, googleSignIn }