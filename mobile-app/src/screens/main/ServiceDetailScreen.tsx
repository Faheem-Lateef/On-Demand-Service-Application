import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView,
    TouchableOpacity, ActivityIndicator, Dimensions, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import api from '../../lib/api';
import { Service, Provider } from '../../types';
import { useServiceProviders } from '../../hooks/useServiceProviders';

const { width } = Dimensions.get('window');

export default function ServiceDetailScreen({ route, navigation }: any) {
    const { service } = route.params;
    const { providers, loading } = useServiceProviders();

    const serviceImage = service.image || 'https://images.unsplash.com/photo-1581578731522-5b17b8822eda?q=80&w=1000&auto=format&fit=crop';

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: serviceImage }} style={styles.heroImage} />
                    <View style={styles.heroOverlay} />
                    <SafeAreaView style={styles.headerControls}>
                        <TouchableOpacity style={styles.backBtn} activeOpacity={0.8} onPress={() => navigation.goBack()}>
                            <Text style={styles.backIcon}>{"\u2190"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
                            <Text style={styles.shareIcon}>{"\uD83D\uDD17"}</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* Service Title & Info */}
                <View style={styles.content}>
                    <View style={styles.premiumBadge}>
                        <Text style={styles.premiumText}>✨ PREMIUM SERVICE</Text>
                    </View>

                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{service.name}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingBox}>
                            <Text style={styles.star}>⭐</Text>
                            <Text style={styles.ratingNum}>4.8</Text>
                            <Text style={styles.reviewsCount}>(124 reviews)</Text>
                        </View>
                        <View style={styles.priceTag}>
                            <Text style={styles.price}>${Number(service.price).toFixed(0)}</Text>
                            <Text style={styles.perSession}>/ hr</Text>
                        </View>
                    </View>

                    {/* Progress Bars for UI (Reviews breakdown) */}
                    <View style={styles.reviewBreakdown}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>5 ⭐</Text>
                            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '80%' }]} /></View>
                            <Text style={styles.progressPercent}>80%</Text>
                        </View>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>4 ⭐</Text>
                            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '15%' }]} /></View>
                            <Text style={styles.progressPercent}>15%</Text>
                        </View>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressLabel}>3 ⭐</Text>
                            <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '5%' }]} /></View>
                            <Text style={styles.progressPercent}>5%</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About Service</Text>
                    <Text style={styles.description}>
                        {service.description || "Our comprehensive service goes beyond regular maintenance. We target hidden dust, grime behind appliances, and sanitize every corner of your living space to ensure maximum hygiene and comfort."}
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagScroll}>
                        <View style={styles.tag}><Text style={styles.tagIcon}>🌱</Text><Text style={styles.tagText}>Eco-friendly</Text></View>
                        <View style={styles.tag}><Text style={styles.tagIcon}>🏆</Text><Text style={styles.tagText}>Top Rated</Text></View>
                        <View style={styles.tag}><Text style={styles.tagIcon}>🛡️</Text><Text style={styles.tagText}>Insured</Text></View>
                    </ScrollView>

                    {/* Available Providers */}
                    <View style={styles.providersHeader}>
                        <Text style={styles.sectionTitle}>Available Professionals</Text>
                        <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator color="#7751FF" style={{ marginTop: 30 }} />
                    ) : (
                        providers.map(provider => (
                            <TouchableOpacity key={provider.id} style={styles.providerCard} activeOpacity={0.8} onPress={() => navigation.navigate('ProviderDetail', { service, provider })}>
                                <Image source={{ uri: provider.avatarUrl || 'https://i.pravatar.cc/150' }} style={styles.providerAvatar} />
                                <View style={styles.providerInfo}>
                                    <Text style={styles.providerName}>{provider.name}</Text>
                                    <Text style={styles.providerMeta}>⭐ {(provider.rating || 4.5).toFixed(1)} • {provider.jobsDone || 0} jobs completed</Text>
                                </View>
                                <View style={styles.arrowBox}>
                                    <Text style={styles.arrowIcon}>{"\u203A"}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Footer Book Button */}
            <View style={styles.footer}>
                <View style={styles.footerPriceCol}>
                    <Text style={styles.totalPriceLabel}>Total Price</Text>
                    <Text style={styles.footerPrice}>${Number(service.price).toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.bookBtn} activeOpacity={0.9} onPress={() => navigation.navigate('BookService', { service })}>
                    <Text style={styles.bookBtnText}>Book Now</Text>
                    <Text style={styles.bookBtnIcon}>{"\u2192"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F0C20' },
    scroll: { flexGrow: 1 },
    imageContainer: { width: '100%', height: 400, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 150,
    },
    headerControls: {
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(15, 12, 32, 0.4)', alignItems: 'center', justifyContent: 'center' },
    backIcon: { color: '#fff', fontSize: 24, fontWeight: '300' },
    shareBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(15, 12, 32, 0.4)', alignItems: 'center', justifyContent: 'center' },
    shareIcon: { color: '#fff', fontSize: 20 },

    content: {
        padding: 24,
        marginTop: -30,
        backgroundColor: '#0F0C20',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    premiumBadge: {
        backgroundColor: 'rgba(119, 81, 255, 0.1)', alignSelf: 'flex-start',
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 16,
        borderWidth: 1, borderColor: 'rgba(119, 81, 255, 0.2)'
    },
    premiumText: { color: '#7751FF', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

    titleRow: { marginBottom: 16 },
    title: { color: '#ffffff', fontSize: 32, fontWeight: '900', lineHeight: 40 },

    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    ratingBox: { flexDirection: 'row', alignItems: 'center' },
    star: { fontSize: 16, marginRight: 6 },
    ratingNum: { color: '#ffffff', fontSize: 16, fontWeight: '800', marginRight: 8 },
    reviewsCount: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },

    priceTag: { flexDirection: 'row', alignItems: 'baseline', backgroundColor: '#16132B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
    price: { color: '#7751FF', fontSize: 24, fontWeight: '900' },
    perSession: { color: '#94a3b8', fontSize: 14, fontWeight: '600', marginLeft: 4 },

    reviewBreakdown: { backgroundColor: '#16132B', padding: 20, borderRadius: 24, marginBottom: 35, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    progressLabel: { color: '#ffffff', fontSize: 13, fontWeight: '600', width: 35 },
    progressBarBg: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, marginHorizontal: 12 },
    progressBarFill: { height: '100%', backgroundColor: '#7751FF', borderRadius: 3 },
    progressPercent: { color: '#94a3b8', fontSize: 13, fontWeight: '600', width: 35, textAlign: 'right' },

    sectionTitle: { color: '#ffffff', fontSize: 20, fontWeight: '800', marginBottom: 16 },
    description: { color: '#94a3b8', fontSize: 15, lineHeight: 24, marginBottom: 24, fontWeight: '500' },

    tagScroll: { marginBottom: 35 },
    tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16132B', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    tagIcon: { fontSize: 16, marginRight: 8 },
    tagText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },

    providersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
    viewAll: { color: '#7751FF', fontSize: 14, fontWeight: '700' },
    providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#16132B', padding: 16, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
    providerAvatar: { width: 56, height: 56, borderRadius: 28 },
    providerInfo: { flex: 1, marginLeft: 16 },
    providerName: { color: '#ffffff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
    providerMeta: { color: '#94a3b8', fontSize: 13, fontWeight: '500' },
    arrowBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
    arrowIcon: { color: '#ffffff', fontSize: 20 },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#16132B', paddingHorizontal: 24, paddingVertical: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.03)',
        paddingBottom: 35
    },
    footerPriceCol: { justifyContent: 'center' },
    totalPriceLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '600', marginBottom: 4 },
    footerPrice: { color: '#ffffff', fontSize: 28, fontWeight: '900' },
    bookBtn: {
        backgroundColor: '#7751FF', paddingHorizontal: 32, paddingVertical: 18,
        borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12,
        shadowColor: '#7751FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8
    },
    bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    bookBtnIcon: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
