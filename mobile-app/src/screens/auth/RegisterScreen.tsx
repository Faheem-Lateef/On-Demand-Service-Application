import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, Alert, Modal, FlatList
} from 'react-native';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface CategoryOption {
    id: string;
    name: string;
}

export default function RegisterScreen({ navigation }: any) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const { login } = useAuth();

    // Fetch categories when user picks PROVIDER
    useEffect(() => {
        if (role === 'PROVIDER') {
            api.get('/categories').then(res => {
                let fetchedCats: CategoryOption[] = res.data.data;
                // Ensure 'Other' is strictly at the bottom
                const otherCat = fetchedCats.find(c => c.name.toLowerCase() === 'other');
                const restCats = fetchedCats.filter(c => c.name.toLowerCase() !== 'other');
                if (otherCat) {
                    setCategories([...restCats, otherCat]);
                } else {
                    setCategories(fetchedCats);
                }
            }).catch(() => { });
        } else {
            setSelectedCategoryId(null);
        }
    }, [role]);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters.');
            return;
        }
        if (role === 'PROVIDER' && !selectedCategoryId) {
            Alert.alert('Select Category', 'Please select your category of expertise.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
                categoryId: role === 'PROVIDER' ? selectedCategoryId : undefined,
            });
            const { user, token } = response.data.data;

            if (role === 'PROVIDER') {
                Alert.alert('Application Submitted', 'Your provider account has been submitted to the admin for review. Once approved, you will appear in customer searches.', [
                    { text: 'OK', onPress: () => login(user, token) }
                ]);
            } else {
                await login(user, token);
            }
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

                    {/* Category Selection for Providers (Dropdown) */}
                    {role === 'PROVIDER' && categories.length > 0 && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>CATEGORY OF EXPERTISE *</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setDropdownVisible(true)}
                            >
                                <Text style={{ color: selectedCategoryId ? '#f1f5f9' : '#475569', fontSize: 15 }}>
                                    {selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name : 'Select a Category...'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

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

            {/* Dropdown Modal for Category Selection */}
            <Modal
                transparent={true}
                visible={dropdownVisible}
                animationType="fade"
                onRequestClose={() => setDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setDropdownVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Category</Text>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalOption}
                                    onPress={() => {
                                        setSelectedCategoryId(item.id);
                                        setDropdownVisible(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.modalOptionText,
                                        selectedCategoryId === item.id && styles.modalOptionTextActive
                                    ]}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

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
    roleBtnActive: { borderColor: '#7751FF', backgroundColor: '#7751FF22' },
    roleBtnText: { color: '#64748b', fontWeight: '600', fontSize: 13 },
    roleBtnTextActive: { color: '#7751FF' },

    serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    serviceChip: {
        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14,
        backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155',
    },
    serviceChipActive: { borderColor: '#7751FF', backgroundColor: '#7751FF22' },
    serviceChipText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
    serviceChipTextActive: { color: '#7751FF' },
    serviceCategoryText: { color: '#475569', fontSize: 10, marginTop: 2 },

    button: {
        backgroundColor: '#7751FF', borderRadius: 14, paddingVertical: 16,
        alignItems: 'center', marginTop: 8,
        shadowColor: '#7751FF', shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    linkRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    linkText: { color: '#64748b', fontSize: 14 },
    link: { color: '#7751FF', fontSize: 14, fontWeight: '600' },

    // Modal Styles
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center', alignItems: 'center',
    },
    modalContent: {
        width: '85%', backgroundColor: '#0f172a',
        borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1e293b',
        maxHeight: '60%',
    },
    modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
    modalOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b' },
    modalOptionText: { color: '#cbd5e1', fontSize: 16, textAlign: 'center' },
    modalOptionTextActive: { color: '#7751FF', fontWeight: 'bold' }
});
