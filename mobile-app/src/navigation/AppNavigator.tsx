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
                headerStyle: { backgroundColor: '#131022' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="ServiceList" component={HomeScreen} options={{ headerShown: false }} />
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
                    backgroundColor: '#131022',
                    borderTopColor: 'rgba(255,255,255,0.05)',
                    borderTopWidth: 1,
                    height: 70,
                    paddingBottom: 12,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#3713ec',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    marginTop: 4,
                    textTransform: 'uppercase'
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarLabel: 'HOME',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Bookings"
                component={BookingsScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#131022' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { fontWeight: '700' },
                    headerShadowVisible: false,
                    title: 'MY BOOKINGS',
                    tabBarLabel: 'BOOKINGS',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📅</Text>,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: '#131022' },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: { fontWeight: '700' },
                    headerShadowVisible: false,
                    title: 'MY PROFILE',
                    tabBarLabel: 'PROFILE',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text>,
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
