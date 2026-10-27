import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { TOTAL_WORDS } from '../data/words';
import { getLearnedWordsCount, getStreak, getAverageQuizAccuracy } from '../utils/storage';

export default function ProfileScreen() {
    const [stats, setStats] = useState({
        wordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        quizAccuracy: 0,
    });

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const loadStats = async () => {
        const learned = await getLearnedWordsCount();
        const streak = await getStreak();
        const accuracy = await getAverageQuizAccuracy();

        setStats({
            wordsLearned: learned,
            currentStreak: streak,
            longestStreak: streak, // For now, same as current
            quizAccuracy: accuracy,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile & Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Learning Stats</Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Words Learned</Text>
                    <Text style={styles.statValue}>{stats.wordsLearned} / {TOTAL_WORDS}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Current Streak</Text>
                    <Text style={styles.statValue}>{stats.currentStreak} days</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Longest Streak</Text>
                    <Text style={styles.statValue}>{stats.longestStreak} days</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Quiz Accuracy</Text>
                    <Text style={styles.statValue}>{stats.quizAccuracy}%</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Settings</Text>
                <TouchableOpacity style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Daily Reminder</Text>
                    <Text style={styles.settingValue}>Off</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Preferred Language</Text>
                    <Text style={styles.settingValue}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Arabic Font Size</Text>
                    <Text style={styles.settingValue}>Large</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.aboutText}>
                    QuranVoc 80 helps you learn the most frequent words that make up 82.6% of the Quran's vocabulary.
                </Text>
                <Text style={styles.aboutText}>
                    Based on research by Dr. Abdulazeez Abdulraheem
                </Text>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: SPACING.lg,
    },
    headerTitle: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    section: {
        backgroundColor: COLORS.cardBackground,
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 12,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    statLabel: {
        fontSize: SIZES.medium,
        color: COLORS.text,
    },
    statValue: {
        fontSize: SIZES.medium,
        fontWeight: '600',
        color: COLORS.primary,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    settingLabel: {
        fontSize: SIZES.medium,
        color: COLORS.text,
    },
    settingValue: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
    },
    aboutText: {
        fontSize: SIZES.medium,
        color: COLORS.text,
        marginBottom: SPACING.sm,
        lineHeight: 22,
    },
    versionText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
});
