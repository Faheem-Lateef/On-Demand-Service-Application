import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    Image, ActivityIndicator, SafeAreaView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useHomeData } from '../../hooks/useHomeData';
import { Provider, Category } from '../../types';

export default function AllProvidersScreen({ navigation }: any) {
    const { providers, categories, loading } = useHomeData();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Derive unique category names from providers' booking history
    const filteredProviders = selectedCategory
        ? providers.filter(p =>
            (p as any).providerBookings?.some(
                (b: any) => b.service?.category?.name === selectedCategory
            )
        )
        : providers;

    const renderProvider = ({ item, index }: { item: Provider; index: number }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ProviderDetail', { provider: item })}
        >
            <Image
                source={{ uri: item.avatarUrl || 'https://i.pravatar.cc/150' }}
                style={styles.avatar}
            />
            <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
                <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>⭐ {(item.rating || 4.8).toFixed(1)}</Text>
                    <Text style={styles.badge}>Available</Text>
                </View>
            </View>
            <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <SafeAreaView>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>All Providers</Text>
                    <View style={{ width: 44 }} />
                </View>

                {/* Category Filter */}
                <FlatList
                    horizontal
                    data={[{ id: '__all__', name: 'All' }, ...categories]}
                    keyExtractor={(c) => c.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScroll}
                    renderItem={({ item: cat }) => {
                        const isActive = selectedCategory === null
                            ? cat.id === '__all__'
                            : selectedCategory === cat.name;
                        return (
                            <TouchableOpacity
                                style={[styles.chip, isActive && styles.chipActive]}
                                onPress={() => setSelectedCategory(cat.id === '__all__' ? null : cat.name)}
                            >
                                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </SafeAreaView>

            {/* Providers List */}
            {loading ? (
                <ActivityIndicator size="large" color="#7751FF" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={filteredProviders}
                    keyExtractor={(p) => p.id}
                    renderItem={renderProvider}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.empty}>No providers found in this category.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F0C20' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: '#16132B', alignItems: 'center', justifyContent: 'center',
    },
    backIcon: { color: '#fff', fontSize: 22 },
    title: { color: '#ffffff', fontSize: 20, fontWeight: '900' },

    filterScroll: { paddingHorizontal: 24, paddingBottom: 16, gap: 10 },
    chip: {
        paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
        backgroundColor: '#16132B', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    },
    chipActive: { backgroundColor: '#7751FF', borderColor: '#7751FF' },
    chipText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
    chipTextActive: { color: '#ffffff' },

    list: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40 },
    card: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#16132B', borderRadius: 20, padding: 16,
        marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)',
    },
    avatar: { width: 60, height: 60, borderRadius: 18 },
    cardInfo: { flex: 1, marginLeft: 14 },
    name: { color: '#ffffff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
    email: { color: '#64748b', fontSize: 12, fontWeight: '500', marginBottom: 8 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    ratingText: { color: '#FFD700', fontSize: 12, fontWeight: '700' },
    badge: {
        backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981',
        fontSize: 11, fontWeight: '800', paddingHorizontal: 8,
        paddingVertical: 3, borderRadius: 8,
    },
    arrow: { color: '#7751FF', fontSize: 24, fontWeight: 'bold' },
    empty: { color: '#475569', textAlign: 'center', marginTop: 40, fontSize: 15 },
});
