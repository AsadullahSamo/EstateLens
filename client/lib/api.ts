import axios from 'axios'

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
})

api.interceptors.request.use(config => {
    const token = typeof window != "undefined" ? localStorage.getItem("access_token") : null
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            const refreshToken = localStorage.getItem("refresh_token")

            if(refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                        {refresh_token: refreshToken}
                    )
                    localStorage.setItem("access_token", data.access_token)
                    originalRequest.headers.Authorization = `Bearer ${data.access_token}`
                    return api(originalRequest)
                } catch {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.dispatchEvent(new Event("auth:logout"));
                }
            } else {
                window.dispatchEvent(new Event("auth:logout"));
            }
        }

        return Promise.reject(error)
    }
)

export default api