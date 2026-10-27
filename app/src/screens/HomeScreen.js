import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { TOTAL_WORDS } from '../data/words';
import { getLearnedWordsCount, getStreak } from '../utils/storage';

export default function HomeScreen({ navigation }) {
    const [wordsLearned, setWordsLearned] = useState(0);
    const [streak, setStreak] = useState(0);
    const [progressPercentage, setProgressPercentage] = useState(0);

    useFocusEffect(
        useCallback(() => {
            loadProgress();
        }, [])
    );

    const loadProgress = async () => {
        const learned = await getLearnedWordsCount();
        const currentStreak = await getStreak();
        setWordsLearned(learned);
        setStreak(currentStreak);
        setProgressPercentage(Math.round((learned / TOTAL_WORDS) * 100));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>QuranVoc 80</Text>
                <Text style={styles.subtitle}>Learn {TOTAL_WORDS} words, understand 82.6% of the Quran</Text>
            </View>

            <View style={styles.progressCard}>
                <Text style={styles.progressTitle}>Your Progress</Text>
                <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
                <Text style={styles.progressSubtext}>Quranic Words Understood</Text>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{wordsLearned}</Text>
                    <Text style={styles.statLabel}>Words Learned</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{streak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
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
