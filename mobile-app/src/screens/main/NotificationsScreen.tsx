import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { BackButton } from '../../components/common/BackButton';
import { useNotifications, Notification } from '../../hooks/useNotifications';

export default function NotificationsScreen() {
    const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
            activeOpacity={0.8}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.title.includes('🎉') ? '🎉' : '🔔'}</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 ? (
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Text style={styles.markAll}>Mark Read</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 60 }} />
                )}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#7751FF" style={{ marginTop: 40 }} />
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>📭</Text>
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderNotification}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F0C20' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 },
    headerTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900' },
    markAll: { color: '#7751FF', fontSize: 13, fontWeight: '700' },

    listContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
    notificationCard: {
        flexDirection: 'row', backgroundColor: '#16132B', borderRadius: 16,
        padding: 16, marginBottom: 16, alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)',
    },
    unreadCard: { borderColor: 'rgba(119,81,255,0.3)', backgroundColor: 'rgba(119,81,255,0.05)' },

    iconContainer: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: '#0F0C20',
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    icon: { fontSize: 20 },

    content: { flex: 1 },
    title: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginBottom: 4 },
    unreadText: { color: '#7751FF' },
    message: { color: '#94a3b8', fontSize: 13, lineHeight: 18, marginBottom: 6 },
    time: { color: '#475569', fontSize: 11, fontWeight: '500' },

    unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7751FF', marginLeft: 10 },

    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
    emptyIcon: { fontSize: 54, marginBottom: 16, opacity: 0.8 },
    emptyText: { color: '#64748b', fontSize: 16, fontWeight: '600' },
});
