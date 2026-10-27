import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ALL_WORDS, meaningOf, pickSession } from '../data/words';
import { saveFlashcardProgress } from '../utils/storage';
import useLanguage from '../hooks/useLanguage';

export default function FlashcardsScreen() {
    // Cards still to be answered this session; the front of the array is current.
    const [session, setSession] = useState(() => pickSession(ALL_WORDS));
    const [queue, setQueue] = useState(session);
    const [isFlipped, setIsFlipped] = useState(false);
    const [language] = useLanguage();

    const currentWord = queue[0];
    const reviewed = session.length - queue.length;

    const handleKnow = async () => {
        await saveFlashcardProgress(currentWord.id, 5);
        setQueue(queue.slice(1));
        setIsFlipped(false);
    };

    // Missed cards go to the back of the queue so they come around again.
    const handleDontKnow = async () => {
        await saveFlashcardProgress(currentWord.id, 2);
        setQueue([...queue.slice(1), currentWord]);
        setIsFlipped(false);
    };

    if (!currentWord) {
        return (
            <View style={styles.container}>
                <Text style={styles.completedText}>🎉 You've reviewed all cards!</Text>
                <TouchableOpacity
                    style={styles.restartButton}
                    onPress={() => {
                        const next = pickSession(ALL_WORDS);
                        setSession(next);
                        setQueue(next);
                        setIsFlipped(false);
                    }}
                >
                    <Text style={styles.restartButtonText}>Start Over</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progressText}>
                    {reviewed} / {session.length} known · {queue.length} left
                </Text>
            </View>

            <TouchableOpacity
                style={styles.card}
                onPress={() => setIsFlipped(!isFlipped)}
                activeOpacity={0.9}
            >
                {!isFlipped ? (
                    <View style={styles.cardFront}>
                        <Text style={styles.arabicText}>{currentWord.arabic}</Text>
                        <Text style={styles.tapHint}>Tap to reveal meaning</Text>
                    </View>
                ) : (
                    <View style={styles.cardBack}>
                        <Text style={styles.meaningText}>
                            {meaningOf(currentWord, language)}
                        </Text>
                        <Text style={styles.infoText}>{currentWord.grammatical_info}</Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.dontKnowButton]}
                    onPress={handleDontKnow}
                >
                    <Text style={styles.buttonText}>❌ Review Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.knowButton]}
                    onPress={handleKnow}
                >
                    <Text style={styles.buttonText}>✅ I Know This</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: SPACING.lg,
    },
    progressText: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
    },
    card: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: SPACING.xl,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        marginBottom: SPACING.lg,
    },
    cardFront: {
        alignItems: 'center',
    },
    cardBack: {
        alignItems: 'center',
    },
    arabicText: {
        fontSize: 48,
        color: COLORS.text,
        marginBottom: SPACING.lg,
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
    dontKnowButton: {
        backgroundColor: COLORS.error,
    },
    knowButton: {
        backgroundColor: COLORS.success,
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
    },
    restartButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        borderRadius: 12,
        alignSelf: 'center',
        marginTop: SPACING.xl,
    },
    restartButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
});
