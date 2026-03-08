import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://10.52.77.25:3000/api', // Local network IP — works for real devices & Expo Go
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally with silent token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    // Attempt to refresh
                    const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
                    const newAccessToken = data.data.token;

                    // Update storage and default header
                    await AsyncStorage.setItem('userToken', newAccessToken);
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, purge state to force re-login
                await AsyncStorage.multiRemove(['userToken', 'userData', 'refreshToken']);
                return Promise.reject(refreshError);
            }
        }

        // If it's 401 but we either have no refresh token or already retried, purge
        if (error.response?.status === 401) {
            await AsyncStorage.multiRemove(['userToken', 'userData', 'refreshToken']);
        }

        return Promise.reject(error);
    }
);

export default api;
