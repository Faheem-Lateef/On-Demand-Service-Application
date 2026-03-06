import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Alert,
} from 'react-native';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
            });
            const { user, token } = response.data.data;
            await login(user, token);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join ServicePro and get things done</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName}
                            placeholder="John Doe" placeholderTextColor="#475569" autoCapitalize="words" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail}
                            placeholder="you@example.com" placeholderTextColor="#475569"
                            keyboardType="email-address" autoCapitalize="none" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput style={styles.input} value={password} onChangeText={setPassword}
                            placeholder="Min. 6 characters" placeholderTextColor="#475569" secureTextEntry />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>I AM A...</Text>
                        <View style={styles.roleRow}>
                            {(['CUSTOMER', 'PROVIDER'] as const).map((r) => (
                                <TouchableOpacity
                                    key={r}
                                    style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                                    onPress={() => setRole(r)}
                                >
                                    <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                                        {r === 'CUSTOMER' ? '🛒 Customer' : '🔧 Provider'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleRegister} disabled={isLoading} activeOpacity={0.85}
                    >
                        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Account</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkRow}>
                        <Text style={styles.linkText}>Already have an account? </Text>
                        <Text style={styles.link}>Sign in</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#020617' },
    container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center' },
    form: { backgroundColor: '#0f172a', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#1e293b' },
    inputGroup: { marginBottom: 18 },
    label: { color: '#475569', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
    input: {
        backgroundColor: '#1e293b', borderRadius: 14, paddingHorizontal: 16,
        paddingVertical: 14, color: '#f1f5f9', fontSize: 15, borderWidth: 1, borderColor: '#334155',
    },
    roleRow: { flexDirection: 'row', gap: 12 },
    roleBtn: {
        flex: 1, paddingVertical: 12, borderRadius: 12,
        borderWidth: 1, borderColor: '#334155', alignItems: 'center',
        backgroundColor: '#1e293b',
    },
    roleBtnActive: { borderColor: '#3b82f6', backgroundColor: '#1d4ed8' + '22' },
    roleBtnText: { color: '#64748b', fontWeight: '600', fontSize: 13 },
    roleBtnTextActive: { color: '#60a5fa' },
    button: {
        backgroundColor: '#2563eb', borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 8,
        shadowColor: '#2563eb', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    linkText: { color: '#64748b', fontSize: 14 },
    link: { color: '#3b82f6', fontSize: 14, fontWeight: '600' },
});
