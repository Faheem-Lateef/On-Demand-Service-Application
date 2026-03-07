import React from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ProviderDetailScreen({ route, navigation }: any) {
    const { provider } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Header Profile Section */}
                <View style={styles.headerBackground}>
                    <SafeAreaView style={styles.headerControls}>
                        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                            <Text style={styles.backIcon}>{"\u2190"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
                            <Text style={styles.shareIcon}>{"\uD83D\uDD17"}</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View style={styles.profileHeader}>
                        <Image source={{ uri: provider.image }} style={styles.profileImage} />
                        <View style={styles.nameSection}>
                            <Text style={styles.providerName}>{provider.name}</Text>
                            <View style={styles.badgeRow}>
                                <View style={styles.verifiedBadge}>
                                    <Text style={styles.verifiedText}>Verified Pro</Text>
                                </View>
                                <View style={styles.ratingBadge}>
                                    <Text style={styles.ratingText}>⭐ {provider.rating}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{provider.jobsDone}+</Text>
                            <Text style={styles.statLabel}>Jobs Done</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{provider.distance}</Text>
                            <Text style={styles.statLabel}>Distance</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>${provider.hourlyRate}</Text>
                            <Text style={styles.statLabel}>Per Hour</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionTitle}>About Specialist</Text>
                    <Text style={styles.description}>
                        With over 5 years of experience, {provider.name} is a top-rated professional dedicated to providing high-quality services. Known for punctuality and attention to detail, ensuring every job is completed to the highest standard.
                    </Text>

                    {/* Skills/Services Section */}
                    <Text style={styles.sectionTitle}>Services Provided</Text>
                    <View style={styles.servicesGrid}>
                        {['Maintenance', 'Repair', 'Installation', 'Consultation'].map((item, index) => (
                            <View key={index} style={styles.serviceTag}>
                                <Text style={styles.serviceTagText}>{item}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Reviews Sneak Peek */}
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle}>Recent Reviews</Text>
                        <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
                    </View>

                    {[1, 2].map((i) => (
                        <View key={i} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <View style={styles.reviewerInfo}>
                                    <View style={styles.reviewerAvatarPlaceholder} />
                                    <Text style={styles.reviewerName}>User {i}</Text>
                                </View>
                                <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
                            </View>
                            <Text style={styles.reviewText}>Excellent work! Very professional and efficient. Highly recommend.</Text>
                        </View>
                    ))}
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Sticky Action Footer */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.chatBtn} activeOpacity={0.8}>
                    <Text style={styles.chatIcon}>💬</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookBtn} activeOpacity={0.9}>
                    <Text style={styles.bookBtnText}>Request Quote</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F0C20' },
    scroll: { flexGrow: 1 },
    headerBackground: {
        backgroundColor: '#16132B',
        paddingBottom: 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center' },
    backIcon: { color: '#fff', fontSize: 24 },
    shareBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center' },
    shareIcon: { color: '#fff', fontSize: 20 },

    profileHeader: {
        alignItems: 'center',
        marginTop: 10,
        paddingHorizontal: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#7751FF',
        marginBottom: 16,
    },
    nameSection: {
        alignItems: 'center',
    },
    providerName: {
        color: '#ffffff',
        fontSize: 26,
        fontWeight: '900',
        marginBottom: 12,
        textAlign: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: 10,
    },
    verifiedBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    verifiedText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '800',
    },
    ratingBadge: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.2)',
    },
    ratingText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: '800',
    },

    content: {
        padding: 24,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: '#16132B',
        borderRadius: 24,
        padding: 20,
        marginBottom: 35,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 4,
    },
    statLabel: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    sectionTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 16,
    },
    description: {
        color: '#94a3b8',
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 30,
        fontWeight: '500',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 35,
    },
    serviceTag: {
        backgroundColor: '#16132B',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    serviceTagText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },

    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    viewAll: {
        color: '#7751FF',
        fontSize: 14,
        fontWeight: '700',
    },
    reviewCard: {
        backgroundColor: '#16132B',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewerAvatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2D284D',
        marginRight: 10,
    },
    reviewerName: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    reviewStars: {
        fontSize: 10,
    },
    reviewText: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '500',
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#16132B',
        paddingHorizontal: 24,
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.03)',
        paddingBottom: 35,
        gap: 15,
    },
    chatBtn: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: '#1E1B32',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    chatIcon: {
        fontSize: 24,
    },
    bookBtn: {
        flex: 1,
        backgroundColor: '#7751FF',
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#7751FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    bookBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },
});
