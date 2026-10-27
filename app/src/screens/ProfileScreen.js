import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { TOTAL_WORDS, HAS_URDU } from '../data/words';
import { getAverageQuizAccuracy, getPreferences } from '../utils/storage';
import { REMINDER_PRESETS, labelFor } from '../utils/reminders';
import { setReminderEnabled, setReminderTime } from '../utils/notifications';
import useLanguage from '../hooks/useLanguage';
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

    const [reminder, setReminder] = useState({ on: false, hour: 19, minute: 0 });
    const [language, setLanguage] = useLanguage();

    const loadReminder = useCallback(async () => {
        const prefs = await getPreferences();
        setReminder({ on: prefs.dailyReminder, hour: prefs.reminderHour, minute: prefs.reminderMinute });
    }, []);

    const toggleReminder = async () => {
        const ok = await setReminderEnabled(!reminder.on);
        if (!ok) {
            Alert.alert('Notifications are off', 'Allow notifications for this app in your phone settings to get reminders.');
        }
        loadReminder();
    };

    const cycleReminderTime = async () => {
        const at = REMINDER_PRESETS.findIndex((p) => p.hour === reminder.hour && p.minute === reminder.minute);
        const next = REMINDER_PRESETS[(at + 1) % REMINDER_PRESETS.length];
        await setReminderTime(next.hour, next.minute);
        loadReminder();
    };

    const loadStats = useCallback(async () => {
        loadReminder();
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
    }, [loadReminder]);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [loadStats])
    );

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
                    <Text style={styles.statLabel}>Qur&apos;an coverage</Text>
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
                <TouchableOpacity style={styles.settingRow} onPress={toggleReminder}>
                    <Text style={styles.settingLabel}>Daily Reminder</Text>
                    <Text style={styles.settingValue}>{reminder.on ? 'On' : 'Off'}</Text>
                </TouchableOpacity>
                {reminder.on && (
                    <TouchableOpacity style={styles.settingRow} onPress={cycleReminderTime}>
                        <Text style={styles.settingLabel}>Reminder time (tap to change)</Text>
                        <Text style={styles.settingValue}>{labelFor(reminder.hour, reminder.minute)}</Text>
                    </TouchableOpacity>
                )}
                {HAS_URDU && (
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => setLanguage(language === 'english' ? 'urdu' : 'english')}
                    >
                        <Text style={styles.settingLabel}>Meaning language</Text>
                        <Text style={styles.settingValue}>{language === 'urdu' ? 'Urdu' : 'English'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.aboutText}>
                    QuranVoc 80 helps you learn the most frequent words that make up 82.6% of the Quran&apos;s vocabulary.
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
