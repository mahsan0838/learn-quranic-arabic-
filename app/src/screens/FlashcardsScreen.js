import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import vocabData from '../data/vocab.json';
import { saveFlashcardProgress } from '../utils/storage';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('english');

    // Combine all words from all modules
    const allWords = [
        ...vocabData.module_1.words,
        ...vocabData.module_2.words,
        ...vocabData.module_3.words,
    ];

    const currentWord = allWords[currentIndex];

    const handleKnow = async () => {
        // Save high familiarity (5 = know well)
        await saveFlashcardProgress(currentWord.id, 5);
        // Move to next card
        if (currentIndex < allWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handleDontKnow = async () => {
        // Save low familiarity (2 = needs review)
        await saveFlashcardProgress(currentWord.id, 2);
        // Move to next card (in real app, would add to review pile)
        if (currentIndex < allWords.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    if (!currentWord) {
        return (
            <View style={styles.container}>
                <Text style={styles.completedText}>🎉 You've reviewed all cards!</Text>
                <TouchableOpacity
                    style={styles.restartButton}
                    onPress={() => {
                        setCurrentIndex(0);
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
                    {currentIndex + 1} / {allWords.length}
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
                            {selectedLanguage === 'english' ? currentWord.english : currentWord.urdu}
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
