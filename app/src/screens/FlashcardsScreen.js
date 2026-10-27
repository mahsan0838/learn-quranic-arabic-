import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SPACING, arabicStyle } from '../constants/theme';
import { CURRICULUM, meaningOf } from '../data/words';
import { buildSession } from '../utils/srs';
import { getSrsMap, recordReview } from '../utils/game';
import { syncReminders } from '../utils/notifications';
import useLanguage from '../hooks/useLanguage';
import RewardBanner from '../components/RewardBanner';

const GRADES = [
    { grade: 'again', label: 'Again', color: COLORS.error },
    { grade: 'good', label: 'Good', color: COLORS.primary },
    { grade: 'easy', label: 'Easy', color: COLORS.accent },
];

export default function FlashcardsScreen() {
    const [language] = useLanguage();
    const [ready, setReady] = useState(false);
    const [queue, setQueue] = useState([]);
    const [counts, setCounts] = useState({ dueCount: 0, newCount: 0 });
    const [isFlipped, setIsFlipped] = useState(false);
    const [reward, setReward] = useState(null);
    const [summary, setSummary] = useState({ cards: 0, xp: 0, again: 0 });
    const [finished, setFinished] = useState(false);
    const busy = useRef(false);
    const started = useRef(false);
    const finishedRef = useRef(false);

    const startSession = useCallback(async () => {
        const srsMap = await getSrsMap();
        const session = buildSession(CURRICULUM, srsMap);
        setQueue(session.cards);
        setCounts({ dueCount: session.dueCount, newCount: session.newCount });
        setSummary({ cards: 0, xp: 0, again: 0 });
        setIsFlipped(false);
        setReward(null);
        setFinished(false);
        finishedRef.current = false;
        setReady(true);
    }, []);

    // Build on first focus, and again when the user returns after finishing a
    // session. Refs keep this effect from re-running (and wiping the summary)
    // as soon as the last card is answered.
    useFocusEffect(
        useCallback(() => {
            if (!started.current || finishedRef.current) {
                started.current = true;
                startSession();
            }
        }, [startSession])
    );

    const currentWord = queue[0];

    const answer = async (grade) => {
        if (busy.current || !currentWord) return;
        busy.current = true;
        try {
            const result = await recordReview(currentWord.id, grade);
            const rest = queue.slice(1);
            // Missed cards come back at the end of this session.
            const nextQueue = grade === 'again' ? [...rest, currentWord] : rest;
            setReward(result);
            if (result.goalReached) syncReminders();
            setSummary((s) => ({
                cards: s.cards + 1,
                xp: s.xp + result.xpGained,
                again: s.again + (grade === 'again' ? 1 : 0),
            }));
            setQueue(nextQueue);
            setIsFlipped(false);
            if (nextQueue.length === 0) {
                setFinished(true);
                finishedRef.current = true;
            }
        } finally {
            busy.current = false;
        }
    };

    if (!ready) {
        return (
            <View style={styles.container}>
                <Text style={styles.completedText}>Loading your cards…</Text>
            </View>
        );
    }

    if (!currentWord) {
        const nothingToDo = summary.cards === 0;
        return (
            <View style={styles.container}>
                <Text style={styles.completedText}>
                    {nothingToDo ? '✅ You are all caught up!' : '🎉 Session complete!'}
                </Text>
                {nothingToDo ? (
                    <Text style={styles.infoText}>
                        Nothing is due right now. Come back later, or take a quiz.
                    </Text>
                ) : (
                    <Text style={styles.infoText}>
                        {summary.cards} reviews · +{summary.xp} XP · {summary.again} to revisit
                    </Text>
                )}
                <RewardBanner result={reward} />
                <TouchableOpacity style={styles.restartButton} onPress={startSession}>
                    <Text style={styles.restartButtonText}>
                        {nothingToDo ? 'Check again' : 'Start another session'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const forms = currentWord.forms;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progressText}>{queue.length} left</Text>
                <Text style={styles.subText}>
                    {counts.dueCount} due · {counts.newCount} new in total
                </Text>
            </View>

            <RewardBanner result={reward} />

            <TouchableOpacity
                style={styles.card}
                onPress={() => setIsFlipped(!isFlipped)}
                activeOpacity={0.9}
            >
                {!isFlipped ? (
                    <View style={styles.cardFace}>
                        <Text style={styles.arabicText}>{currentWord.arabic}</Text>
                        <Text style={styles.tapHint}>Tap to reveal meaning</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={styles.cardFace}>
                        <Text style={styles.arabicSmall}>{currentWord.arabic}</Text>
                        <Text style={styles.meaningText}>{meaningOf(currentWord, language)}</Text>
                        <Text style={styles.infoText}>{currentWord.grammatical_info}</Text>
                        {currentWord.frequency != null && (
                            <Text style={styles.infoText}>
                                Appears {currentWord.frequency}× in the Qur'an
                            </Text>
                        )}
                        {forms && (
                            <Text style={styles.formsText}>
                                {[forms.present, forms.imperative, forms.active_participle, forms.verbal_noun].join('   ')}
                            </Text>
                        )}
                    </ScrollView>
                )}
            </TouchableOpacity>

            {isFlipped ? (
                <View style={styles.buttonContainer}>
                    {GRADES.map((g) => (
                        <TouchableOpacity
                            key={g.grade}
                            style={[styles.actionButton, { backgroundColor: g.color }]}
                            onPress={() => answer(g.grade)}
                        >
                            <Text style={styles.buttonText}>{g.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ) : (
                <TouchableOpacity style={styles.revealButton} onPress={() => setIsFlipped(true)}>
                    <Text style={styles.buttonText}>Show answer</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.md,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    progressText: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
    },
    subText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: SPACING.lg,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginBottom: SPACING.md,
    },
    cardFace: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arabicText: {
        ...arabicStyle(48),
        color: COLORS.text,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    arabicSmall: {
        ...arabicStyle(32),
        color: COLORS.primary,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    tapHint: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    meaningText: {
        fontSize: SIZES.xlarge,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    infoText: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    formsText: {
        ...arabicStyle(24),
        color: COLORS.text,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: SPACING.xs,
    },
    revealButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
    completedText: {
        fontSize: SIZES.xlarge,
        textAlign: 'center',
        color: COLORS.text,
        marginTop: SPACING.xl,
        marginBottom: SPACING.md,
    },
    restartButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        borderRadius: 12,
        alignSelf: 'center',
        marginTop: SPACING.lg,
    },
    restartButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
});
