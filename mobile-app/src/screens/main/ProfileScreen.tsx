import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]);
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'ADMIN': return { label: '🛡️ Administrator', color: '#f87171' };
            case 'PROVIDER': return { label: '🔧 Service Provider', color: '#fbbf24' };
            default: return { label: '🛒 Customer', color: '#60a5fa' };
        }
    };

    const roleInfo = getRoleLabel(user?.role || 'CUSTOMER');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || '?'}</Text>
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <View style={[styles.roleBadge, { borderColor: roleInfo.color + '44' }]}>
                    <Text style={[styles.roleText, { color: roleInfo.color }]}>{roleInfo.label}</Text>
                </View>
            </View>

            {/* Info Cards */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Full Name</Text>
                    <Text style={styles.infoValue}>{user?.name}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>{user?.email}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Account Type</Text>
                    <Text style={[styles.infoValue, { color: roleInfo.color }]}>{user?.role}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>User ID</Text>
                    <Text style={styles.infoValue} numberOfLines={1}>{user?.id?.slice(0, 8)}...</Text>
                </View>
            </View>

            {/* App Version */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>App Version</Text>
                    <Text style={styles.infoValue}>1.0.0</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Platform</Text>
                    <Text style={styles.infoValue}>ServicePro Mobile</Text>
                </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    content: { padding: 24, paddingBottom: 48 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 96, height: 96, borderRadius: 32,
        backgroundColor: '#1e40af', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16, shadowColor: '#2563eb', shadowOpacity: 0.6, shadowRadius: 24, elevation: 10,
        borderWidth: 3, borderColor: '#2563eb44',
    },
    avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
    name: { color: '#f1f5f9', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    email: { color: '#64748b', fontSize: 14, marginBottom: 12 },
    roleBadge: {
        paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
        borderWidth: 1, backgroundColor: '#0f172a',
    },
    roleText: { fontWeight: '700', fontSize: 13 },
    infoCard: {
        backgroundColor: '#0f172a', borderRadius: 20,
        borderWidth: 1, borderColor: '#1e293b', marginBottom: 16,
        paddingHorizontal: 20,
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
    infoLabel: { color: '#64748b', fontSize: 14 },
    infoValue: { color: '#cbd5e1', fontSize: 14, fontWeight: '500', maxWidth: '55%', textAlign: 'right' },
    divider: { height: 1, backgroundColor: '#1e293b' },
    logoutBtn: {
        backgroundColor: '#7f1d1d22', borderWidth: 1, borderColor: '#f8717144',
        borderRadius: 18, paddingVertical: 18, alignItems: 'center', marginTop: 8,
    },
    logoutText: { color: '#f87171', fontWeight: '700', fontSize: 16 },
});
