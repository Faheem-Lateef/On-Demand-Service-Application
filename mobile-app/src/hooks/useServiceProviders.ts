import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Provider } from '../types';

export function useServiceProviders() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProviders = async () => {
        try {
            const res = await api.get('/users/providers');
            // Data from DB already contains avatarUrl, name, email. 
            // We map them to ensure any missing fields have safe UI defaults.
            const realProviders = res.data.data.map((p: Provider) => ({
                ...p,
                rating: p.rating || 4.8,
                jobsDone: p.jobsDone || 12, // Minimal UI filler if fresh
                avatarUrl: p.avatarUrl || `https://i.pravatar.cc/150?u=${p.id}`
            }));
            setProviders(realProviders);
        } catch (err) {
            console.error('Error fetching providers:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    return { providers, loading };
}
