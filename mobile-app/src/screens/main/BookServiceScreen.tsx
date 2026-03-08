import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ScrollView, ActivityIndicator, Alert, Platform,
} from 'react-native';
import api from '../../lib/api';

export default function BookServiceScreen({ route, navigation }: any) {
    const { service, provider } = route.params;
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');

    const handleBook = async () => {
        console.log('Book button clicked');
        console.log('Service:', service?.id);
        console.log('Provider:', provider?.id);
        console.log('Inputs:', { address, scheduledDate, scheduledTime });

        if (!address.trim() || !scheduledDate.trim() || !scheduledTime.trim()) {
            console.log('Validation failed: missing fields');
            Alert.alert('Missing Info', 'Please fill in address, date, and time.');
            return;
        }

        const combined = `${scheduledDate}T${scheduledTime}:00`;
        const scheduledAt = new Date(combined);
        console.log('Parsed Date:', scheduledAt.toString());

        if (isNaN(scheduledAt.getTime())) {
            console.log('Validation failed: invalid date format');
            Alert.alert('Invalid Date/Time', 'Use format YYYY-MM-DD for date and HH:MM for time.');
            return;
        }
        if (scheduledAt <= new Date()) {
            console.log('Validation failed: time in past');
            Alert.alert('Invalid Time', 'Scheduled time must be in the future.');
            return;
        }

        setIsLoading(true);
        setLoadingText('Saving Booking...');
        console.log('Starting API calls...');

        try {
            const payload = {
                serviceId: service.id,
                providerId: provider?.id || undefined,
                scheduledTime: scheduledAt.toISOString(),
                address: address.trim(),
                notes: notes.trim() || undefined,
            };
            console.log('Booking Payload:', payload);

            const bookingRes = await api.post('/bookings', payload);
            console.log('Booking created:', bookingRes.data);

            const bookingId = bookingRes.data.data.id;

            setLoadingText('Processing Payment...');
            const paymentRes = await api.post('/payments', {
                bookingId,
                amount: service.price,
                paymentMethodId: 'pm_mock_12345'
            });
            console.log('Payment processed:', paymentRes.data);

            Alert.alert(
                'Booking & Payment Confirmed! 🎉',
                `Your "${service.name}" appointment is secured.\nTransaction ID: ${paymentRes.data.data.transactionId}`,
                [
                    { text: 'View My Bookings', onPress: () => navigation.navigate('Bookings') },
                    { text: 'OK', style: 'cancel' },
                ]
            );
        } catch (error: any) {
            console.error('Booking Error:', error);
            if (error.response) {
                console.error('Response Error Data:', error.response.data);
            }
            Alert.alert('Booking Failed', error.response?.data?.message || 'Something went wrong. Try again.');
        } finally {
            setIsLoading(false);
            setLoadingText('');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Service Summary */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                    <Text style={styles.summaryIconText}>✦</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.summaryName}>{service.name}</Text>
                    {provider && (
                        <Text style={styles.providerBadge}>With Professional: {provider.name}</Text>
                    )}
                    <Text style={styles.summaryPrice}>Total: ${service.price}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>APPOINTMENT DETAILS</Text>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>SERVICE ADDRESS *</Text>
                <TextInput
                    style={[styles.input, styles.inputMulti]}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="123 Main St, Your City"
                    placeholderTextColor="#475569"
                    multiline
                    numberOfLines={3}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>DATE *</Text>
                    <TextInput
                        style={styles.input}
                        value={scheduledDate}
                        onChangeText={setScheduledDate}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#475569"
                        keyboardType="numeric"
                    />
                </View>
                <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>TIME *</Text>
                    <TextInput
                        style={styles.input}
                        value={scheduledTime}
                        onChangeText={setScheduledTime}
                        placeholder="HH:MM"
                        placeholderTextColor="#475569"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>NOTES (OPTIONAL)</Text>
                <TextInput
                    style={[styles.input, styles.inputMulti]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Any specific instructions for the provider..."
                    placeholderTextColor="#475569"
                    multiline
                    numberOfLines={3}
                />
            </View>

            {/* Price Footer */}
            <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Service Total</Text>
                <Text style={styles.priceValue}>${service.price}</Text>
            </View>

            <TouchableOpacity
                style={[styles.confirmBtn, isLoading && { opacity: 0.6 }]}
                onPress={handleBook}
                disabled={isLoading}
                activeOpacity={0.85}
            >
                {isLoading
                    ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <ActivityIndicator color="#fff" />
                            <Text style={styles.confirmBtnText}>{loadingText}</Text>
                        </View>
                    )
                    : <Text style={styles.confirmBtnText}>Confirm Booking & Pay</Text>
                }
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    content: { padding: 20, paddingBottom: 40 },
    summaryCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#0f172a', borderRadius: 20, padding: 20,
        borderWidth: 1, borderColor: '#1e293b', marginBottom: 28,
    },
    summaryIcon: {
        width: 52, height: 52, borderRadius: 14,
        backgroundColor: '#1e40af22', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: '#1e40af',
    },
    summaryIconText: { color: '#60a5fa', fontSize: 22 },
    summaryName: { color: '#f1f5f9', fontWeight: '700', fontSize: 17 },
    providerBadge: { color: '#7751FF', fontWeight: '800', fontSize: 13, marginTop: 4, textTransform: 'uppercase' },
    summaryPrice: { color: '#34d399', fontWeight: '600', fontSize: 14, marginTop: 4 },
    sectionTitle: { color: '#475569', fontWeight: '700', fontSize: 11, letterSpacing: 1.5, marginBottom: 16 },
    fieldGroup: { marginBottom: 16 },
    label: { color: '#64748b', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
    input: {
        backgroundColor: '#0f172a', borderRadius: 14, paddingHorizontal: 16,
        paddingVertical: 14, color: '#f1f5f9', fontSize: 15,
        borderWidth: 1, borderColor: '#1e293b',
    },
    inputMulti: { minHeight: 80, textAlignVertical: 'top' },
    row: { flexDirection: 'row', gap: 12 },
    priceRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#0f172a', borderRadius: 16, padding: 18,
        marginBottom: 16, borderWidth: 1, borderColor: '#1e293b',
    },
    priceLabel: { color: '#94a3b8', fontWeight: '600', fontSize: 15 },
    priceValue: { color: '#34d399', fontWeight: 'bold', fontSize: 22 },
    confirmBtn: {
        backgroundColor: '#2563eb', borderRadius: 18, paddingVertical: 18,
        alignItems: 'center', shadowColor: '#2563eb', shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
    },
    confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 17, letterSpacing: 0.5 },
});
