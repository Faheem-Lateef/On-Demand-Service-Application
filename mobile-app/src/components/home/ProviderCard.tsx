import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Provider } from '../../types';

interface ProviderCardProps {
    provider: Provider;
    index: number;
    onPress: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, index, onPress }) => {
    const avatar = provider.avatarUrl || 'https://i.pravatar.cc/150'; // Minimal fallback only

    return (
        <TouchableOpacity
            style={styles.providerCard}
            activeOpacity={0.8}
            onPress={() => onPress(provider)}
        >
            <Image
                source={{ uri: avatar }}
                style={styles.providerAvatar}
            />
            <View style={styles.providerDetails}>
                <View style={styles.providerHeader}>
                    <Text style={styles.providerName} numberOfLines={1}>{provider.name}</Text>
                    <View style={styles.providerRatingBox}>
                        <Text style={styles.providerRatingText}>⭐ {provider.rating ? provider.rating.toFixed(1) : '4.8'}</Text>
                    </View>
                </View>
                <Text style={styles.categoryBadge}>{(provider as any).category?.name || 'Pro'}</Text>
                <Text style={styles.jobsDone}>{provider.email}</Text>
                <View style={styles.providerStats}>
                    <Text style={styles.providerDistance}>📍 Nearby</Text>
                    <Text style={styles.providerPrice}>Available<Text style={styles.providerPriceUnit}> Now</Text></Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
    categoryBadge: { color: '#7751FF', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
    providerRatingBox: { backgroundColor: 'rgba(119, 81, 255, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    providerRatingText: { color: '#7751FF', fontSize: 12, fontWeight: '800' },
    jobsDone: { color: '#94a3b8', fontSize: 12, marginBottom: 10, fontWeight: '500' },
    providerStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    providerDistance: { color: '#64748b', fontSize: 12, fontWeight: '600' },
    providerPrice: { color: '#10B981', fontSize: 14, fontWeight: '700' },
    providerPriceUnit: { color: '#64748b', fontSize: 12, fontWeight: '500' },
});
