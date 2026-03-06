import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please enter your email and password.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email: email.trim(), password });
            const { user, token } = response.data.data;
            await login(user, token);
        } catch (error: any) {
            Alert.alert('Login Failed', error.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>SP</Text>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your ServicePro account</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="you@example.com"
                            placeholderTextColor="#475569"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            placeholderTextColor="#475569"
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                        activeOpacity={0.85}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkRow}>
                        <Text style={styles.linkText}>Don't have an account? </Text>
                        <Text style={styles.link}>Create one</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#020617' },
    container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoBox: {
        width: 72, height: 72, borderRadius: 20,
        backgroundColor: '#2563eb', alignItems: 'center',
        justifyContent: 'center', marginBottom: 20,
        shadowColor: '#2563eb', shadowOpacity: 0.5, shadowRadius: 16, elevation: 10,
    },
    logoText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center' },
    form: {
        backgroundColor: '#0f172a', borderRadius: 24,
        padding: 24, borderWidth: 1, borderColor: '#1e293b',
    },
    inputGroup: { marginBottom: 18 },
    label: { color: '#475569', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 },
    input: {
        backgroundColor: '#1e293b', borderRadius: 14, paddingHorizontal: 16,
        paddingVertical: 14, color: '#f1f5f9', fontSize: 15,
        borderWidth: 1, borderColor: '#334155',
    },
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
