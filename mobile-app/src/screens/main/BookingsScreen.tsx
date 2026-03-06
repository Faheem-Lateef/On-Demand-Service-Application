import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    ActivityIndicator, RefreshControl, Alert, TouchableOpacity,
} from 'react-native';
import api from '../../lib/api';

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: '#78350f22', text: '#fbbf24' },
    ACCEPTED: { bg: '#1e3a5f22', text: '#60a5fa' },
    COMPLETED: { bg: '#064e3b22', text: '#34d399' },
    REJECTED: { bg: '#450a0a22', text: '#f87171' },
};

export default function BookingsScreen() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/my-bookings');
            setBookings(res.data.data);
        } catch {
            Alert.alert('Error', 'Could not load bookings.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);
    const onRefresh = useCallback(() => { setRefreshing(true); fetchBookings(); }, []);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading your bookings...</Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.container}
            data={bookings.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
            ListHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Bookings</Text>
                    <Text style={styles.headerSub}>{bookings.length} appointment{bookings.length !== 1 ? 's' : ''}</Text>
                </View>
            }
            renderItem={({ item }) => {
                const colors = STATUS_COLORS[item.status] || STATUS_COLORS.PENDING;
                const scheduledDate = new Date(item.scheduledAt);
                return (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.serviceName}>{item.service?.name}</Text>
                                <Text style={styles.categoryName}>{item.service?.category?.name}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                                <Text style={[styles.badgeText, { color: colors.text }]}>{item.status}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.details}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>📅 Date</Text>
                                <Text style={styles.detailValue}>
                                    {scheduledDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>⏰ Time</Text>
                                <Text style={styles.detailValue}>
                                    {scheduledDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>📍 Address</Text>
                                <Text style={styles.detailValue} numberOfLines={1}>{item.address}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>💵 Total</Text>
                                <Text style={[styles.detailValue, { color: '#34d399', fontWeight: 'bold' }]}>
                                    ${item.totalAmount}
                                </Text>
                            </View>
                        </View>

                        {item.notes ? (
                            <View style={styles.notesBox}>
                                <Text style={styles.notesText}>"{item.notes}"</Text>
                            </View>
                        ) : null}
                    </View>
                );
            }}
            ListEmptyComponent={
                <View style={styles.empty}>
                    <Text style={styles.emptyIcon}>📅</Text>
                    <Text style={styles.emptyTitle}>No bookings yet</Text>
                    <Text style={styles.emptySubtitle}>Head home to book your first service!</Text>
                </View>
            }
            contentContainerStyle={{ paddingBottom: 32 }}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    centered: { flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#64748b', marginTop: 12, fontSize: 14 },
    header: { padding: 24, paddingBottom: 16 },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    headerSub: { color: '#64748b', fontSize: 14, marginTop: 4 },
    card: {
        marginHorizontal: 20, marginBottom: 14,
        backgroundColor: '#0f172a', borderRadius: 20,
        padding: 18, borderWidth: 1, borderColor: '#1e293b',
    },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    serviceName: { color: '#f1f5f9', fontWeight: '700', fontSize: 16, marginBottom: 2 },
    categoryName: { color: '#64748b', fontSize: 12 },
    badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
    badgeText: { fontWeight: '700', fontSize: 11, letterSpacing: 0.5 },
    divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 14 },
    details: { gap: 10 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { color: '#64748b', fontSize: 13 },
    detailValue: { color: '#cbd5e1', fontSize: 13, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
    notesBox: {
        marginTop: 12, backgroundColor: '#1e293b', borderRadius: 12, padding: 12,
        borderLeftWidth: 3, borderLeftColor: '#3b82f6',
    },
    notesText: { color: '#94a3b8', fontSize: 13, fontStyle: 'italic' },
    empty: { alignItems: 'center', paddingTop: 80 },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyTitle: { color: '#cbd5e1', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    emptySubtitle: { color: '#64748b', fontSize: 14, textAlign: 'center' },
});
