import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
    Image, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ navigation }: any) {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: logout },
        ]);
    };

    const MenuItem = ({ icon, title, onPress, color = '#3713ec', isLogout = false }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, isLogout && styles.logoutItem]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: isLogout ? 'rgba(239, 68, 68, 0.1)' : 'rgba(55, 19, 236, 0.1)' }]}>
                <Text style={[styles.menuIcon, { color: isLogout ? '#ef4444' : color }]}>{icon}</Text>
            </View>
            <Text style={[styles.menuTitle, isLogout && { color: '#ef4444' }]}>{title}</Text>
            <Text style={styles.chevron}>{"\u203A"}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />

            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Text style={styles.headerIcon}>{"\u2190"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <Text style={styles.headerIcon}>{"\u2699"}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: `https://i.pravatar.cc/150?u=${user?.id || 'faheem'}` }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBtn}>
                            <Text style={styles.editIcon}>{"\u270E"}</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Faheem'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'faheem@servicehub.com'}</Text>
                    <Text style={styles.userPhone}>+1 234 567 890</Text>
                </View>

                {/* Menu Section */}
                <View style={styles.menuContainer}>
                    <MenuItem
                        icon={"\uD83D\uDC64"}
                        title="Edit Profile"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon={"\uD83D\uDCC5"}
                        title="Booking History"
                        onPress={() => navigation.navigate('Bookings')}
                    />
                    <MenuItem
                        icon={"\uD83D\uDCB5"}
                        title="Payment Methods"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon={"\u2753"}
                        title="Help & Support"
                        onPress={() => { }}
                    />

                    <View style={styles.logoutWrapper}>
                        <MenuItem
                            icon={"\u21AA"}
                            title="Logout"
                            onPress={handleLogout}
                            isLogout={true}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#131022' },
    content: { paddingBottom: 40 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
    headerBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerIcon: { color: '#ffffff', fontSize: 24 },

    profileInfo: { alignItems: 'center', marginTop: 10, marginBottom: 30 },
    avatarContainer: { position: 'relative', marginBottom: 20 },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'rgba(55, 19, 236, 0.3)'
    },
    editBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3713ec',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#131022'
    },
    editIcon: { color: '#ffffff', fontSize: 14 },
    userName: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
    userEmail: { color: '#3713ec', fontSize: 16, fontWeight: '500', marginBottom: 4 },
    userPhone: { color: '#94a3b8', fontSize: 14 },

    menuContainer: { paddingHorizontal: 20 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e1b32',
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15
    },
    menuIcon: { fontSize: 20 },
    menuTitle: { flex: 1, color: '#ffffff', fontSize: 16, fontWeight: '600' },
    chevron: { color: '#94a3b8', fontSize: 24 },

    logoutWrapper: { marginTop: 10 },
    logoutItem: { backgroundColor: 'rgba(239, 68, 68, 0.05)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.1)' },
});
