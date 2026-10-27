import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { TOTAL_WORDS } from '../data/words';
import { getAverageQuizAccuracy } from '../utils/storage';
import { getDashboard } from '../utils/game';
import { BADGES, levelProgress, titleFor } from '../utils/gamification';

export default function ProfileScreen() {
    const [stats, setStats] = useState({
        wordsLearned: 0,
        currentStreak: 0,
        longestStreak: 0,
        quizAccuracy: 0,
        xp: 0,
        coverage: 0,
        badges: [],
    });

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const loadStats = async () => {
        const dash = await getDashboard();
        const accuracy = await getAverageQuizAccuracy();
        setStats({
            wordsLearned: dash.known,
            currentStreak: dash.streak,
            longestStreak: dash.longestStreak,
            quizAccuracy: accuracy,
            xp: dash.xp,
            coverage: dash.coveragePct,
            badges: dash.badges,
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
                    <Text style={styles.statLabel}>Words Known</Text>
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
                <Text style={styles.sectionTitle}>
                    Level {levelProgress(stats.xp).level} · {titleFor(levelProgress(stats.xp).level)}
                </Text>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total XP</Text>
                    <Text style={styles.statValue}>{stats.xp}</Text>
                </View>
                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Qur'an coverage</Text>
                    <Text style={styles.statValue}>{stats.coverage.toFixed(1)}%</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Badges</Text>
                {BADGES.map((b) => {
                    const earned = stats.badges.includes(b.id);
                    return (
                        <View key={b.id} style={[styles.statRow, !earned && { opacity: 0.4 }]}>
                            <Text style={styles.statLabel}>{earned ? b.icon : '🔒'} {b.title}</Text>
                            <Text style={styles.settingValue}>{b.description}</Text>
                        </View>
                    );
                })}
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
