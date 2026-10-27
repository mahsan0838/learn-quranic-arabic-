import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { ALL_WORDS } from '../data/words';
import { buildQuiz } from '../utils/quiz';
import { saveQuizScore } from '../utils/storage';
import { recordQuiz } from '../utils/game';
import RewardBanner from '../components/RewardBanner';

export default function QuizScreen() {
    const [questions, setQuestions] = useState(() => buildQuiz(ALL_WORDS));
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [reward, setReward] = useState(null);

    const current = questions[currentQuestion];
    const currentWord = current?.word;
    const options = current?.options ?? [];

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer);
        if (answer === currentWord.english) {
            setScore(score + 1);
        }
    };

    const handleNext = async () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            await saveQuizScore(score, questions.length);
            setReward(await recordQuiz(score, questions.length));
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setQuestions(buildQuiz(ALL_WORDS));
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setReward(null);
    };

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <View style={styles.container}>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Quiz Complete! 🎉</Text>
                    <Text style={styles.resultScore}>{score} / {questions.length}</Text>
                    <Text style={styles.resultPercentage}>{percentage}%</Text>
                    <RewardBanner result={reward} />
                    <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
                        <Text style={styles.restartButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!currentWord) {
        return (
            <View style={styles.container}>
                <Text>Loading quiz...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progressText}>
                    Question {currentQuestion + 1} / {questions.length}
                </Text>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionLabel}>What is the meaning of:</Text>
                <Text style={styles.arabicText}>{currentWord.arabic}</Text>
            </View>

            <ScrollView style={styles.optionsContainer}>
                {options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentWord.english;
                    const showCorrect = selectedAnswer && isCorrect;
                    const showWrong = selectedAnswer && isSelected && !isCorrect;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                showCorrect && styles.correctOption,
                                showWrong && styles.wrongOption,
                            ]}
                            onPress={() => !selectedAnswer && handleAnswer(option)}
                            disabled={selectedAnswer !== null}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {selectedAnswer && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </Text>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    progressText: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.text,
    },
    scoreText: {
        fontSize: SIZES.large,
        fontWeight: '600',
        color: COLORS.primary,
    },
    questionContainer: {
        backgroundColor: COLORS.cardBackground,
        padding: SPACING.xl,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        elevation: 2,
    },
    questionLabel: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
    },
    arabicText: {
        fontSize: 48,
        color: COLORS.text,
    },
    optionsContainer: {
        flex: 1,
    },
    optionButton: {
        backgroundColor: COLORS.cardBackground,
        padding: SPACING.lg,
        borderRadius: 12,
        marginBottom: SPACING.md,
        elevation: 2,
    },
    correctOption: {
        backgroundColor: COLORS.success,
    },
    wrongOption: {
        backgroundColor: COLORS.error,
    },
    optionText: {
        fontSize: SIZES.large,
        color: COLORS.text,
        textAlign: 'center',
    },
    nextButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: SPACING.md,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
    resultContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: SIZES.xxlarge,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.lg,
    },
    resultScore: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    resultPercentage: {
        fontSize: SIZES.xlarge,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },
    restartButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        borderRadius: 12,
    },
    restartButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.large,
        fontWeight: 'bold',
    },
});
