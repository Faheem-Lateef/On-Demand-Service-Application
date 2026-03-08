import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle unauthorized errors with silent refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (typeof window !== 'undefined') {
                try {
                    const refreshToken = localStorage.getItem('adminRefreshToken');
                    if (refreshToken) {
                        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
                        const newAccessToken = data.data.token;

                        localStorage.setItem('adminToken', newAccessToken);
                        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminRefreshToken');
                    localStorage.removeItem('adminUser');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        // Fallback or if retry fails/no token
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminRefreshToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
