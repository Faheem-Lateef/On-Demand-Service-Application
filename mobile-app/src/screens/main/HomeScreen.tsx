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
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Brush Masters Painting',
        jobsDone: 185,
        rating: 4.7,
        distance: '2.5 km away',
        hourlyRate: 40,
        image: 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=100&auto=format&fit=crop'
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
            const allServices: Service[] = data.flatMap(c => c.services.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description,
                price: s.price,
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
        const lowerName = name.toLowerCase();
        if (lowerName.includes('sofa')) return 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('deep') || lowerName.includes('home')) return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('clean')) return 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('ac') || lowerName.includes('repair')) return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('plumb')) return 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('electric')) return 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('paint')) return 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('garden') || lowerName.includes('lawn')) return 'https://images.unsplash.com/photo-1592424001809-8b01bb5dae2d?q=80&w=500&auto=format&fit=crop';
        if (lowerName.includes('assemble') || lowerName.includes('furnitur')) return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop';
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7751FF" />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop' }}
                                style={styles.avatar}
                            />
                            <View style={styles.onlineStatus} />
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.welcomeText}>Good morning ☀️</Text>
                            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Faheem'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
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
                            placeholder="What do you need help with?"
                            placeholderTextColor="#64748B"
                        />
                        <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
                            <Text style={styles.filterIcon}>🎛️</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Promotional Banner */}
                <View style={styles.bannerContainer}>
                    <View style={styles.banner}>
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>30% OFF</Text>
                            <Text style={styles.bannerSub}>On all cleaning services</Text>
                            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.9}>
                                <Text style={styles.bannerBtnText}>Claim Now</Text>
                            </TouchableOpacity>
                        </View>
                        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3223/3223066.png' }} style={styles.bannerImage} />
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
                        <TouchableOpacity key={cat.id} style={styles.catItem} activeOpacity={0.8}>
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
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('ServiceDetail', { service })}
                        >
                            <Image source={{ uri: service.image }} style={styles.serviceImage} />
                            <View style={styles.ratingBadge}>
                                <Text style={styles.starIcon}>⭐</Text>
                                <Text style={styles.ratingText}>{service.rating?.toFixed(1) || '4.5'}</Text>
                            </View>
                            <View style={styles.serviceInfo}>
                                <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
                                <View style={styles.servicePrice}>
                                    <Text style={styles.priceAmount}>${Number(service.price || 0).toFixed(0)}</Text>
                                    <Text style={styles.priceUnit}> /hr</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Recommended Providers */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Top Providers</Text>
                </View>
                <View style={styles.providersList}>
                    {MOCK_PROVIDERS.map((provider) => (
                        <TouchableOpacity
                            key={provider.id}
                            style={styles.providerCard}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate('ProviderDetail', { provider })}
                        >
                            <Image source={{ uri: provider.image }} style={styles.providerAvatar} />
                            <View style={styles.providerDetails}>
                                <View style={styles.providerHeader}>
                                    <Text style={styles.providerName}>{provider.name}</Text>
                                    <View style={styles.providerRatingBox}>
                                        <Text style={styles.providerRatingText}>⭐ {provider.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.jobsDone}>{provider.jobsDone}+ jobs done</Text>
                                <View style={styles.providerStats}>
                                    <Text style={styles.providerDistance}>📍 {provider.distance}</Text>
                                    <Text style={styles.providerPrice}>${provider.hourlyRate}<Text style={styles.providerPriceUnit}>/hr</Text></Text>
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
    safeArea: { flex: 1, backgroundColor: '#0F0C20' },
    container: { flex: 1 },
    centered: { flex: 1, backgroundColor: '#0F0C20', alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#94a3b8', marginTop: 12, fontSize: 15, fontWeight: '500' },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    avatarContainer: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#7751FF' },
    onlineStatus: {
        position: 'absolute', bottom: 2, right: 2,
        width: 14, height: 14, borderRadius: 7,
        backgroundColor: '#10B981', borderWidth: 2, borderColor: '#0F0C20'
    },
    headerText: { marginLeft: 16 },
    welcomeText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    userName: { color: '#ffffff', fontSize: 22, fontWeight: '800', marginTop: 2 },
    notificationBtn: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: '#16132B', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
    },
    notificationIcon: { fontSize: 22 },
    notificationDot: {
        position: 'absolute', top: 12, right: 12,
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: '#FF3B30', borderWidth: 2, borderColor: '#16132B'
    },

    searchSection: { paddingHorizontal: 24, marginBottom: 25 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#16132B',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)'
    },
    searchIcon: { fontSize: 20, color: '#64748b' },
    searchInput: { flex: 1, color: '#ffffff', fontSize: 16, paddingHorizontal: 12, height: 50 },
    filterBtn: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: '#7751FF', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#7751FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    filterIcon: { fontSize: 18, color: '#ffffff' },

    bannerContainer: { paddingHorizontal: 24, marginBottom: 30 },
    banner: {
        flexDirection: 'row',
        backgroundColor: '#7751FF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
    },
    bannerContent: { zIndex: 1 },
    bannerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginBottom: 6 },
    bannerSub: { color: '#E2D8FF', fontSize: 14, fontWeight: '500', marginBottom: 16 },
    bannerBtn: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignSelf: 'flex-start' },
    bannerBtnText: { color: '#7751FF', fontSize: 14, fontWeight: 'bold' },
    bannerImage: { position: 'absolute', right: -20, bottom: -20, width: 140, height: 140, opacity: 0.9, transform: [{ rotate: '-10deg' }] },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 24,
        marginBottom: 16
    },
    sectionTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800' },
    seeAll: { color: '#7751FF', fontSize: 14, fontWeight: '700' },

    catScroll: { paddingLeft: 24, paddingRight: 10, marginBottom: 35 },
    catItem: { alignItems: 'center', marginRight: 22 },
    catIconBox: {
        width: 72, height: 72, borderRadius: 24,
        backgroundColor: '#16132B', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)'
    },
    catIconText: { fontSize: 32 },
    catLabel: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },

    popularScroll: { paddingLeft: 24, paddingRight: 10, marginBottom: 35 },
    serviceCard: {
        width: width * 0.55,
        backgroundColor: '#16132B',
        borderRadius: 28,
        marginRight: 18,
        padding: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)'
    },
    serviceImage: { width: '100%', height: 140, borderRadius: 20 },
    ratingBadge: {
        position: 'absolute', top: 22, right: 22,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(15, 12, 32, 0.7)',
        paddingHorizontal: 10, paddingVertical: 6,
        borderRadius: 14
    },
    starIcon: { fontSize: 12, marginRight: 4 },
    ratingText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
    serviceInfo: { paddingTop: 16, paddingHorizontal: 8, paddingBottom: 8 },
    serviceName: { color: '#ffffff', fontSize: 17, fontWeight: '800', marginBottom: 8 },
    servicePrice: { flexDirection: 'row', alignItems: 'baseline' },
    priceAmount: { color: '#7751FF', fontSize: 20, fontWeight: '900' },
    priceUnit: { color: '#64748B', fontSize: 14, fontWeight: '600' },

    providersList: { paddingHorizontal: 24 },
    providerCard: {
        flexDirection: 'row',
        backgroundColor: '#16132B',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)'
    },
    providerAvatar: { width: 70, height: 70, borderRadius: 20 },
    providerDetails: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    providerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    providerName: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
    providerRatingBox: { backgroundColor: 'rgba(119, 81, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    providerRatingText: { color: '#7751FF', fontSize: 12, fontWeight: '800' },
    jobsDone: { color: '#94a3b8', fontSize: 13, marginBottom: 10, fontWeight: '500' },
    providerStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    providerDistance: { color: '#64748b', fontSize: 13, fontWeight: '600' },
    providerPrice: { color: '#ffffff', fontSize: 17, fontWeight: '900' },
    providerPriceUnit: { color: '#64748b', fontSize: 12, fontWeight: '500' }
});
