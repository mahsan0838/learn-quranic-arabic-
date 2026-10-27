import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { TOTAL_WORDS } from '../data/words';
import { getDashboard } from '../utils/game';
import { BADGES, DAILY_GOAL, levelProgress, titleFor } from '../utils/gamification';

export default function HomeScreen({ navigation }) {
    const [dash, setDash] = useState(null);

    useFocusEffect(
        useCallback(() => {
            getDashboard().then(setDash);
        }, [])
    );

    const xp = dash?.xp ?? 0;
    const level = levelProgress(xp);
    const coverage = dash?.coveragePct ?? 0;
    const goalPct = Math.min(100, Math.round(((dash?.reviewsToday ?? 0) / DAILY_GOAL) * 100));
    const earned = BADGES.filter((b) => dash?.badges.includes(b.id));
    const toReview = (dash?.dueCount ?? 0) + Math.min(dash?.newCount ?? 0, 10);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>QuranVoc 80</Text>
                <Text style={styles.subtitle}>Learn {TOTAL_WORDS} words, understand 82.6% of the Quran</Text>
            </View>

            <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Level {level.level} · {titleFor(level.level)}</Text>
                <Text style={styles.progressSubtext}>
                    {level.xpIntoLevel} / {level.xpForLevel} XP to level {level.level + 1}
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${level.pct}%` }]} />
                </View>
            </View>

            <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => navigation.navigate('Flashcards')}
            >
                <Text style={styles.reviewButtonTitle}>
                    {toReview > 0 ? `Start today's review` : 'Practice flashcards'}
                </Text>
                <Text style={styles.reviewButtonSub}>
                    {dash?.dueCount ?? 0} due · {Math.min(dash?.newCount ?? 0, 10)} new
                </Text>
            </TouchableOpacity>

            <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Daily goal</Text>
                <Text style={styles.progressSubtext}>
                    {dash?.reviewsToday ?? 0} / {DAILY_GOAL} reviews today
                </Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${goalPct}%` }]} />
                </View>
            </View>

            <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Qur'an coverage</Text>
                <Text style={styles.progressPercentage}>{coverage.toFixed(1)}%</Text>
                <Text style={styles.progressSubtext}>of the Qur'an's words you can now understand</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${Math.min(100, (coverage / 82.6) * 100)}%` }]} />
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{dash?.known ?? 0}</Text>
                    <Text style={styles.statLabel}>Words Known</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{dash?.streak ?? 0}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{xp}</Text>
                    <Text style={styles.statLabel}>Total XP</Text>
                </View>
            </View>

            <View style={styles.badgeRow}>
                <Text style={styles.sectionTitle}>Badges {earned.length}/{BADGES.length}</Text>
                <Text style={styles.badgeIcons}>
                    {earned.length ? earned.map((b) => b.icon).join('  ') : 'Review a card to earn your first badge'}
                </Text>
            </View>

            <View style={styles.modulesContainer}>
                <Text style={styles.sectionTitle}>Learning Modules</Text>

                <TouchableOpacity
                    style={styles.moduleCard}
                    onPress={() => navigation.navigate('Learn', { module: 1 })}
                >
                    <Text style={styles.moduleTitle}>Module 1: High-Frequency Words</Text>
                    <Text style={styles.moduleSubtitle}>41.5% of the Quran • pronouns, particles, prepositions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.moduleCard}
                    onPress={() => navigation.navigate('Learn', { module: 2 })}
                >
                    <Text style={styles.moduleTitle}>Module 2: Key Nouns & Attributes</Text>
                    <Text style={styles.moduleSubtitle}>Attributes of Allah, prophets, the Last Day, family, people</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.moduleCard}
                    onPress={() => navigation.navigate('Learn', { module: 3 })}
                >
                    <Text style={styles.moduleTitle}>Module 3: Essential Verbs</Text>
                    <Text style={styles.moduleSubtitle}>Verbs with past, present, imperative, participle & noun</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    reviewButton: {
        backgroundColor: COLORS.secondary,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },
    reviewButtonTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    reviewButtonSub: {
        fontSize: SIZES.medium,
        color: COLORS.text,
        opacity: 0.8,
    },
    badgeRow: {
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        padding: SPACING.md,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
    },
    badgeIcons: {
        fontSize: SIZES.large,
        color: COLORS.textSecondary,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    title: {
        fontSize: SIZES.xxlarge,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: SIZES.medium,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    progressCard: {
        backgroundColor: COLORS.cardBackground,
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    progressTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    progressPercentage: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    progressSubtext: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.md,
    },
    statCard: {
        backgroundColor: COLORS.cardBackground,
        padding: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: SPACING.xs,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statNumber: {
        fontSize: SIZES.xxlarge,
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
    statLabel: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    modulesContainer: {
        padding: SPACING.md,
    },
    sectionTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    moduleCard: {
        backgroundColor: COLORS.cardBackground,
        padding: SPACING.lg,
        borderRadius: 12,
        marginBottom: SPACING.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    moduleTitle: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    moduleSubtitle: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
    },
});
