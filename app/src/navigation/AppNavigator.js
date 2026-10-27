import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import LearnScreen from '../screens/LearnScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import QuizScreen from '../screens/QuizScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: COLORS.primary,
                    tabBarInactiveTintColor: COLORS.textSecondary,
                    tabBarStyle: {
                        backgroundColor: COLORS.cardBackground,
                        borderTopWidth: 1,
                        borderTopColor: '#E0E0E0',
                        paddingBottom: 5,
                        paddingTop: 5,
                        height: 60,
                    },
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: '#FFFFFF',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="Learn"
                    component={LearnScreen}
                    options={{
                        tabBarLabel: 'Learn',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📖</Text>,
                    }}
                />
                <Tab.Screen
                    name="Flashcards"
                    component={FlashcardsScreen}
                    options={{
                        tabBarLabel: 'Flashcards',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎴</Text>,
                    }}
                />
                <Tab.Screen
                    name="Quiz"
                    component={QuizScreen}
                    options={{
                        tabBarLabel: 'Quiz',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>✍️</Text>,
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
                        headerShown: false,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
