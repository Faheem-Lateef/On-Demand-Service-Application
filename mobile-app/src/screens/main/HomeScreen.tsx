import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerHomeScreen from './CustomerHomeScreen';
import ProviderHomeScreen from './ProviderHomeScreen';

export default function HomeScreen(props: any) {
    const { user } = useAuth();

    // Check role and render appropriate home screen
    // Backend roles are usually 'CUSTOMER' and 'PROVIDER'
    if (user?.role === 'PROVIDER') {
        return <ProviderHomeScreen {...props} />;
    }

    return <CustomerHomeScreen {...props} />;
}
