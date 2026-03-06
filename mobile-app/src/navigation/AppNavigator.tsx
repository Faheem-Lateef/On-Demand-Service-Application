import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';

import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import BookingsScreen from '../screens/main/BookingsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import BookServiceScreen from '../screens/main/BookServiceScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#020617' },
                headerTintColor: '#f1f5f9',
                headerTitleStyle: { fontWeight: '700' },
            }}
        >
            <Stack.Screen name="ServiceList" component={HomeScreen} options={{ title: 'Services' }} />
            <Stack.Screen
                name="BookService"
                component={BookServiceScreen}
                options={({ route }: any) => ({ title: route.params?.service?.name || 'Book Service' })}
            />
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a',
                    borderTopColor: '#1e293b',
                    borderTopWidth: 1,
                    paddingBottom: 6,
                    paddingTop: 6,
                    height: 62,
                },
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#475569',
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: 2 },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingsScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#020617' },
                    headerTintColor: '#f1f5f9',
                    headerTitleStyle: { fontWeight: '700' },
                    title: 'My Bookings',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#020617' },
                    headerTintColor: '#f1f5f9',
                    headerTitleStyle: { fontWeight: '700' },
                    title: 'My Profile',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
                }}
            />
        </Tab.Navigator>
    );
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#020617', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isLoggedIn ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
}
