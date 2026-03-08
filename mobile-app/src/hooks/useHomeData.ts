import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import api from '../lib/api';
import { Category, Service, Provider } from '../types';
import { getServiceImage } from '../utils/imageMapper';

export function useHomeData() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [popularServices, setPopularServices] = useState<Service[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const [categoriesRes, providersRes] = await Promise.all([
                api.get('/categories'),
                api.get('/users/providers'),
            ]);

            const data: Category[] = categoriesRes.data.data;
            setCategories(data);

            const allServices: Service[] = data.flatMap(c => c.services.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                price: s.price,
                rating: 4.8, // Standardize to static or fetch from DB in future
                image: getServiceImage(s.name)
            })));
            setPopularServices(allServices.slice(0, 5));

            setProviders(providersRes.data.data);
        } catch {
            Alert.alert('Error', 'Failed to load data. Is the backend running?');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchData(); };

    return { categories, popularServices, providers, loading, refreshing, onRefresh };
}
