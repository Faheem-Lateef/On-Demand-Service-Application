import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Image, Dimensions,
    RefreshControl, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import api from '../../lib/api';
import { useNotifications } from '../../hooks/useNotifications';

const { width } = Dimensions.get('window');

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B' },
    ACCEPTED: { bg: 'rgba(16,185,129,0.12)', text: '#10B981' },
    COMPLETED: { bg: 'rgba(99,102,241,0.12)', text: '#6366F1' },
    REJECTED: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444' },
};

export default function ProviderHomeScreen({ navigation }: any) {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // bookingId being actioned
    const { unreadCount } = useNotifications();

    const fetchData = useCallback(async () => {
        try {
            const res = await api.get('/users/provider-bookings');
            setBookings(res.data.data);
        } catch (error) {
            console.error('Error fetching provider bookings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onRefresh = () => { setRefreshing(true); fetchData(); };

    const handleAccept = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            await api.patch(`/bookings/${bookingId}/accept`);
            Alert.alert('✅ Accepted', 'You have accepted this booking. The customer has been notified.');
            fetchData(); // Refresh to reflect new state
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to accept booking.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (bookingId: string) => {
        Alert.alert('Reject Job?', 'Are you sure you want to reject this booking?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject', style: 'destructive', onPress: async () => {
                    setActionLoading(bookingId);
                    try {
                        await api.patch(`/bookings/${bookingId}/reject`);
                        Alert.alert('Rejected', 'Booking has been rejected.');
                        fetchData();
                    } catch (error: any) {
                        Alert.alert('Error', error.response?.data?.message || 'Failed to reject booking.');
                    } finally {
                        setActionLoading(null);
                    }
                }
            }
        ]);
    };

    const StatCard = ({ title, value, color }: any) => (
        <View style={styles.statCard}>
            <Text style={styles.statLabel}>{title}</Text>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
        </View>
    );

    const QuickAction = ({ icon, title, color, onPress }: any) => (
        <TouchableOpacity style={styles.actionItem} activeOpacity={0.8} onPress={onPress}>
            <View style={[styles.actionIconBox, { backgroundColor: color + '20' }]}>
                <Text style={[styles.actionIcon]}>{icon}</Text>
            </View>
            <Text style={styles.actionLabel}>{title}</Text>
        </TouchableOpacity>
    );

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
    const acceptedCount = bookings.filter(b => b.status === 'ACCEPTED').length;

    if (loading && !refreshing) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#7751FF" />
                <Text style={styles.loadingText}>Loading dashboard...</Text>
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
                    <View>
                        <Text style={styles.welcomeText}>Provider Dashboard ⚡</Text>
                        <Text style={styles.userName}>Hello, {user?.name?.split(' ')[0] || 'Pro'}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&auto=format&fit=crop' }}
                            style={styles.avatar}
                        />
                        {unreadCount > 0 ? (
                            <View style={[styles.onlineStatus, { backgroundColor: '#EF4444' }]} />
                        ) : (
                            <View style={styles.onlineStatus} />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard title="Total Jobs" value={bookings.length.toString()} color="#7751FF" />
                    <StatCard title="Pending" value={pendingCount.toString()} color="#F59E0B" />
                    <StatCard title="Accepted" value={acceptedCount.toString()} color="#10B981" />
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <QuickAction icon="📅" title="Bookings" color="#7751FF" onPress={() => navigation.navigate('Bookings')} />
                    <QuickAction icon="👤" title="Profile" color="#6366F1" onPress={() => navigation.navigate('Profile')} />
                    <QuickAction icon="🔔" title="Alerts" color="#10B981" onPress={() => navigation.navigate('Notifications')} />
                    <QuickAction icon="💬" title="Messages" color="#3B82F6" onPress={() => { }} />
                </View>

                {/* Incoming Booking Requests */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {pendingCount > 0 ? `🔔 ${pendingCount} New Request${pendingCount > 1 ? 's' : ''}` : 'Job Requests'}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                {bookings.length > 0 ? (
                    bookings.slice(0, 5).map(item => {
                        const scheduledDate = new Date(item.scheduledAt);
                        const colors = STATUS_COLORS[item.status] || STATUS_COLORS.PENDING;
                        const isActioning = actionLoading === item.id;

                        return (
                            <View key={item.id} style={styles.bookingCard}>
                                {/* Card Header */}
                                <View style={styles.bookingTop}>
                                    <View style={styles.bookingInfo}>
                                        <Text style={styles.bookingService}>{item.service?.name}</Text>
                                        <Text style={styles.bookingCustomer}>👤 {item.customer?.name || 'Customer'}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
                                        <Text style={[styles.statusText, { color: colors.text }]}>{item.status}</Text>
                                    </View>
                                </View>

                                {/* Details Row */}
                                <View style={styles.detailRow}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailIcon}>📅</Text>
                                        <Text style={styles.detailText}>
                                            {scheduledDate.toLocaleDateString([], { day: 'numeric', month: 'short' })}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailIcon}>⏰</Text>
                                        <Text style={styles.detailText}>
                                            {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailIcon}>💵</Text>
                                        <Text style={[styles.detailText, { color: '#7751FF', fontWeight: '800' }]}>
                                            ${item.totalAmount}
                                        </Text>
                                    </View>
                                </View>

                                {/* Address */}
                                {item.address ? (
                                    <View style={styles.addressRow}>
                                        <Text style={styles.addressIcon}>📍</Text>
                                        <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                                    </View>
                                ) : null}

                                {/* Action Buttons — only shown for PENDING jobs */}
                                {item.status === 'PENDING' && (
                                    <View style={styles.actionRow}>
                                        <TouchableOpacity
                                            style={[styles.rejectBtn, isActioning && { opacity: 0.5 }]}
                                            onPress={() => handleReject(item.id)}
                                            disabled={!!actionLoading}
                                        >
                                            {isActioning
                                                ? <ActivityIndicator size="small" color="#EF4444" />
                                                : <Text style={styles.rejectBtnText}>✕ Decline</Text>}
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.acceptBtn, isActioning && { opacity: 0.5 }]}
                                            onPress={() => handleAccept(item.id)}
                                            disabled={!!actionLoading}
                                        >
                                            {isActioning
                                                ? <ActivityIndicator size="small" color="#fff" />
                                                : <Text style={styles.acceptBtnText}>✓ Accept Job</Text>}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyEmoji}>🎉</Text>
                        <Text style={styles.emptyTitle}>All caught up!</Text>
                        <Text style={styles.emptyText}>No pending bookings at the moment.</Text>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0F0C20' },
    container: { flex: 1 },
    centered: { flex: 1, backgroundColor: '#0F0C20', alignItems: 'center', justifyContent: 'center' },
    loadingText: { color: '#64748B', marginTop: 12, fontSize: 14 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },
    welcomeText: { color: '#94a3b8', fontSize: 13, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    userName: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginTop: 4 },
    profileBtn: { position: 'relative' },
    avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#7751FF' },
    onlineStatus: {
        position: 'absolute', bottom: 2, right: 2,
        width: 14, height: 14, borderRadius: 7,
        backgroundColor: '#10B981', borderWidth: 2, borderColor: '#0F0C20'
    },

    statsGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 30 },
    statCard: {
        backgroundColor: '#16132B',
        width: (width - 68) / 3,
        padding: 16, borderRadius: 20, alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)'
    },
    statLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    statValue: { fontSize: 20, fontWeight: '900' },

    sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '800', marginLeft: 24, marginBottom: 16 },
    actionsGrid: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 30 },
    actionItem: { width: (width - 32) / 4, alignItems: 'center' },
    actionIconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    actionIcon: { fontSize: 22 },
    actionLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '600', textAlign: 'center' },

    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 24, marginBottom: 16
    },
    seeAll: { color: '#7751FF', fontSize: 14, fontWeight: '700' },

    bookingCard: {
        backgroundColor: '#16132B', marginHorizontal: 24, marginBottom: 16,
        borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)'
    },
    bookingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
    bookingInfo: { flex: 1, marginRight: 12 },
    bookingService: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 4 },
    bookingCustomer: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    statusText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },

    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    detailItem: { flexDirection: 'row', alignItems: 'center' },
    detailIcon: { fontSize: 13, marginRight: 5 },
    detailText: { color: '#CBD5E1', fontSize: 13, fontWeight: '600' },

    addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    addressIcon: { fontSize: 13, marginRight: 6 },
    addressText: { color: '#64748B', fontSize: 12, flex: 1 },

    actionRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
    rejectBtn: {
        flex: 1, paddingVertical: 12, borderRadius: 14,
        backgroundColor: 'rgba(239,68,68,0.08)',
        borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
        alignItems: 'center', justifyContent: 'center'
    },
    rejectBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
    acceptBtn: {
        flex: 2, paddingVertical: 12, borderRadius: 14,
        backgroundColor: '#7751FF', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#7751FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    acceptBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },

    emptyCard: {
        marginHorizontal: 24, padding: 40, backgroundColor: '#16132B',
        borderRadius: 24, alignItems: 'center',
        borderStyle: 'dashed', borderWidth: 1, borderColor: '#2D284D'
    },
    emptyEmoji: { fontSize: 40, marginBottom: 12 },
    emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 8 },
    emptyText: { color: '#64748B', fontSize: 14, textAlign: 'center' },
});
