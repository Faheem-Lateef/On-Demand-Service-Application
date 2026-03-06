import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, ActivityIndicator, Platform, Alert,
    ScrollView, Image, TextInput, Dimensions, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    rating?: number;
    image?: string;
}

interface Category {
    id: string;
    name: string;
    description: string;
    services: Service[];
    icon?: string;
}

interface Provider {
    id: string;
    name: string;
    jobsDone: number;
    rating: number;
    distance: string;
    hourlyRate: number;
    image: string;
}

const MOCK_PROVIDERS: Provider[] = [
    {
        id: '1',
        name: 'Elite Electric Solutions',
        jobsDone: 240,
        rating: 4.9,
        distance: '1.2 km away',
        hourlyRate: 35,
        image: 'https://images.unsplash.com/photo-1570126128898-46c7048a00c1?q=80&w=100&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Brush Masters Painting',
        jobsDone: 185,
        rating: 4.7,
        distance: '2.5 km away',
        hourlyRate: 40,
        image: 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=100&auto=format&fit=crop'
    }
];

const CATEGORY_ICONS: Record<string, string> = {
    'Cleaning': '🧹',
    'Plumbing': '🔧',
    'Electrician': '⚡',
    'AC Repair': '❄️',
    'Painting': '🎨',
};

export default function HomeScreen({ navigation }: any) {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [popularServices, setPopularServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get('/categories');
            const data: Category[] = res.data.data;
            setCategories(data);

            // Extract all services for "Popular" section
            const allServices = data.flatMap(c => c.services.map(s => ({
                ...s,
                rating: 4.5 + Math.random() * 0.5,
                image: getServiceImage(s.name)
            })));
            setPopularServices(allServices.slice(0, 5));
        } catch {
            Alert.alert('Error', 'Failed to load services. Is the backend running?');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getServiceImage = (name: string) => {
        if (name.toLowerCase().includes('clean')) return 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=500&auto=format&fit=crop';
        if (name.toLowerCase().includes('ac') || name.toLowerCase().includes('repair')) return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop';
        return 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=500&auto=format&fit=crop';
    }

    useEffect(() => { fetchData(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchData(); };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3713ec" />
                <Text style={styles.loadingText}>Loading your services...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3713ec" />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop' }}
                            style={styles.avatar}
                        />
                        <View style={styles.headerText}>
                            <Text style={styles.welcomeText}>Welcome back,</Text>
                            <Text style={styles.userName}>Hello {user?.name?.split(' ')[0] || 'Faheem'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search for services (e.g. Cleaning)"
                            placeholderTextColor="#64748b"
                        />
                        <TouchableOpacity style={styles.filterBtn}>
                            <Text style={styles.filterIcon}>🎛️</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity key={cat.id} style={styles.catItem}>
                            <View style={styles.catIconBox}>
                                <Text style={styles.catIconText}>{CATEGORY_ICONS[cat.name] || '✦'}</Text>
                            </View>
                            <Text style={styles.catLabel}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Popular Services */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Services</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>View All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularScroll}>
                    {popularServices.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            style={styles.serviceCard}
                            onPress={() => navigation.navigate('BookService', { service })}
                        >
                            <Image source={{ uri: service.image }} style={styles.serviceImage} />
                            <View style={styles.ratingBadge}>
                                <Text style={styles.starIcon}>⭐</Text>
                                <Text style={styles.ratingText}>{service.rating?.toFixed(1) || '4.5'}</Text>
                            </View>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <View style={styles.servicePrice}>
                                    <Text style={styles.priceAmount}>${Number(service.price || 0).toFixed(2)}</Text>
                                    <Text style={styles.priceUnit}> /hr</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Recommended Providers */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommended Providers</Text>
                </View>
                <View style={styles.providersList}>
                    {MOCK_PROVIDERS.map((provider) => (
                        <TouchableOpacity key={provider.id} style={styles.providerCard}>
                            <Image source={{ uri: provider.image }} style={styles.providerAvatar} />
                            <View style={styles.providerDetails}>
                                <View style={styles.providerHeader}>
                                    <Text style={styles.providerName}>{provider.name}</Text>
                                    <Text style={styles.providerPrice}>${provider.hourlyRate}/hr</Text>
                                </View>
                                <Text style={styles.jobsDone}>{provider.jobsDone}+ completed jobs</Text>
                                <View style={styles.providerStats}>
                                    <Text style={styles.providerRating}>⭐ {provider.rating}</Text>
                                    <View style={styles.statDivider} />
                                    <Text style={styles.providerDistance}>{provider.distance}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#131022' },
    container: { flex: 1 },
    centered: { flex: 1, backgroundColor: '#131022', alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 14 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#3713ec' },
    headerText: { marginLeft: 12 },
    welcomeText: { color: '#94a3b8', fontSize: 14 },
    userName: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    notificationBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#1e1b32', alignItems: 'center', justifyContent: 'center',
        position: 'relative'
    },
    notificationIcon: { fontSize: 20 },
    notificationDot: {
        position: 'absolute', top: 12, right: 12,
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: '#3713ec', borderWidth: 1, borderColor: '#131022'
    },

    searchSection: { paddingHorizontal: 20, marginBottom: 25 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1b32',
        borderRadius: 16,
        paddingHorizontal: 15,
        height: 56
    },
    searchIcon: { fontSize: 18, color: '#64748b' },
    searchInput: { flex: 1, color: '#ffffff', fontSize: 15, paddingHorizontal: 10 },
    filterBtn: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: '#3713ec', alignItems: 'center', justifyContent: 'center'
    },
    filterIcon: { fontSize: 16, color: '#ffffff' },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15
    },
    sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    seeAll: { color: '#3713ec', fontSize: 14, fontWeight: '600' },

    catScroll: { paddingLeft: 20, paddingRight: 10, marginBottom: 30 },
    catItem: { alignItems: 'center', marginRight: 20 },
    catIconBox: {
        width: 68, height: 68, borderRadius: 20,
        backgroundColor: '#1e1b32', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10
    },
    catIconText: { fontSize: 28 },
    catLabel: { color: '#ffffff', fontSize: 13, fontWeight: '500' },

    popularScroll: { paddingLeft: 20, paddingRight: 10, marginBottom: 30 },
    serviceCard: {
        width: width * 0.45,
        backgroundColor: '#1e1b32',
        borderRadius: 24,
        marginRight: 15,
        overflow: 'hidden',
        position: 'relative'
    },
    serviceImage: { width: '100%', height: 120 },
    ratingBadge: {
        position: 'absolute', top: 10, right: 10,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 10
    },
    starIcon: { fontSize: 10, marginRight: 3 },
    ratingText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
    serviceInfo: { padding: 15 },
    serviceName: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', marginBottom: 5 },
    servicePrice: { flexDirection: 'row', alignItems: 'baseline' },
    priceAmount: { color: '#3713ec', fontSize: 16, fontWeight: 'bold' },
    priceUnit: { color: '#64748b', fontSize: 12 },

    providersList: { paddingHorizontal: 20 },
    providerCard: {
        flexDirection: 'row',
        backgroundColor: '#1e1b32',
        borderRadius: 20,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    providerAvatar: { width: 64, height: 64, borderRadius: 16 },
    providerDetails: { flex: 1, marginLeft: 15 },
    providerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    providerName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
    providerPrice: { color: '#3713ec', fontSize: 15, fontWeight: 'bold' },
    jobsDone: { color: '#94a3b8', fontSize: 13, marginBottom: 6 },
    providerStats: { flexDirection: 'row', alignItems: 'center' },
    providerRating: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
    statDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#64748b', marginHorizontal: 8 },
    providerDistance: { color: '#64748b', fontSize: 12 },
});
