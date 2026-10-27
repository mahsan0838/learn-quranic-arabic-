import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SPACING, arabicStyle } from '../constants/theme';
import { ALL_WORDS, getModule, getModuleWords, MODULE_IDS } from '../data/words';
import { buildQuiz, weakWords } from '../utils/quiz';
import { saveQuizScore } from '../utils/storage';
import { recordQuiz, getSrsMap } from '../utils/game';
import RewardBanner from '../components/RewardBanner';

const DIRECTIONS = [
    { value: 'toMeaning', label: 'Arabic → meaning' },
    { value: 'toArabic', label: 'Meaning → Arabic' },
];

const Chip = ({ label, active, disabled, onPress }) => (
    <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
    >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
);

export default function QuizScreen() {
    const [stage, setStage] = useState('setup'); // 'setup' | 'play' | 'result'
    const [direction, setDirection] = useState('toMeaning');
    const [scope, setScope] = useState('all'); // 'all' | 1 | 2 | 3 | 'weak'
    const [weakCount, setWeakCount] = useState(0);
    const [srsMap, setSrsMap] = useState({});

    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [reward, setReward] = useState(null);

    useFocusEffect(
        useCallback(() => {
            getSrsMap().then((map) => {
                setSrsMap(map);
                setWeakCount(weakWords(ALL_WORDS, map).length);
            });
        }, [])
    );

    const wordsForScope = () => {
        if (scope === 'weak') return weakWords(ALL_WORDS, srsMap);
        if (scope === 'all') return ALL_WORDS;
        return getModuleWords(scope);
    };

    const start = () => {
        const source = wordsForScope();
        setQuestions(buildQuiz(source, 10, 4, { direction, pool: ALL_WORDS }));
        setIndex(0);
        setScore(0);
        setSelected(null);
        setReward(null);
        setStage('play');
    };

    const current = questions[index];

    const answer = (option) => {
        setSelected(option);
        if (option === current.answer) setScore(score + 1);
    };

    const next = async () => {
        if (index < questions.length - 1) {
            setIndex(index + 1);
            setSelected(null);
            return;
        }
        await saveQuizScore(score, questions.length, typeof scope === 'number' ? scope : null);
        setReward(await recordQuiz(score, questions.length));
        setStage('result');
    };

    if (stage === 'setup') {
        const canStart = scope !== 'weak' || weakCount >= 4;
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.setup}>
                <Text style={styles.sectionLabel}>Question type</Text>
                <View style={styles.chipRow}>
                    {DIRECTIONS.map((d) => (
                        <Chip key={d.value} label={d.label} active={direction === d.value} onPress={() => setDirection(d.value)} />
                    ))}
                </View>

                <Text style={styles.sectionLabel}>Words</Text>
                <View style={styles.chipRow}>
                    <Chip label="All" active={scope === 'all'} onPress={() => setScope('all')} />
                    {MODULE_IDS.map((id) => (
                        <Chip key={id} label={`Module ${id}`} active={scope === id} onPress={() => setScope(id)} />
                    ))}
                    <Chip
                        label={`Weak words (${weakCount})`}
                        active={scope === 'weak'}
                        onPress={() => setScope('weak')}
                    />
                </View>
                {typeof scope === 'number' && <Text style={styles.hint}>{getModule(scope).name}</Text>}
                {scope === 'weak' && (
                    <Text style={styles.hint}>
                        {weakCount >= 4
                            ? 'Words you have missed or are still learning in flashcards.'
                            : 'Review some flashcards first; at least 4 weak words are needed.'}
                    </Text>
                )}

                <TouchableOpacity
                    style={[styles.nextButton, !canStart && styles.chipDisabled]}
                    disabled={!canStart}
                    onPress={start}
                >
                    <Text style={styles.nextButtonText}>Start quiz</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    if (stage === 'result') {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <View style={styles.container}>
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Quiz Complete! 🎉</Text>
                    <Text style={styles.resultScore}>{score} / {questions.length}</Text>
                    <Text style={styles.resultPercentage}>{percentage}%</Text>
                    <RewardBanner result={reward} />
                    <TouchableOpacity style={styles.restartButton} onPress={start}>
                        <Text style={styles.restartButtonText}>Same quiz again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.restartButton, styles.secondaryButton]} onPress={() => setStage('setup')}>
                        <Text style={styles.restartButtonText}>Change settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const isArabicOptions = current.direction === 'toArabic';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progressText}>Question {index + 1} / {questions.length}</Text>
                <Text style={styles.scoreText}>Score: {score}</Text>
            </View>

            <View style={styles.questionContainer}>
                <Text style={styles.questionLabel}>
                    {isArabicOptions ? 'Which Arabic word means:' : 'What is the meaning of:'}
                </Text>
                <Text style={isArabicOptions ? styles.englishPrompt : styles.arabicText}>{current.prompt}</Text>
                {isArabicOptions && <Text style={styles.hint}>{current.hint}</Text>}
            </View>

            <ScrollView style={styles.optionsContainer}>
                {current.options.map((option) => {
                    const isCorrect = option === current.answer;
                    const showCorrect = selected !== null && isCorrect;
                    const showWrong = selected === option && !isCorrect;
                    return (
                        <TouchableOpacity
                            key={option}
                            style={[styles.optionButton, showCorrect && styles.correctOption, showWrong && styles.wrongOption]}
                            onPress={() => selected === null && answer(option)}
                            disabled={selected !== null}
                        >
                            <Text style={isArabicOptions ? styles.arabicOptionText : styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {selected !== null && (
                <TouchableOpacity style={styles.nextButton} onPress={next}>
                    <Text style={styles.nextButtonText}>
                        {index < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md },
    setup: { paddingBottom: SPACING.xl },
    sectionLabel: { fontSize: SIZES.large, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
    chip: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    chipActive: { backgroundColor: COLORS.primary },
    chipDisabled: { opacity: 0.4 },
    chipText: { fontSize: SIZES.medium, color: COLORS.primary },
    chipTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
    hint: { fontSize: SIZES.small, color: COLORS.textSecondary, marginTop: SPACING.xs, textAlign: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.lg },
    progressText: { fontSize: SIZES.large, fontWeight: '600', color: COLORS.text },
    scoreText: { fontSize: SIZES.large, fontWeight: '600', color: COLORS.primary },
    questionContainer: {
        backgroundColor: COLORS.cardBackground,
        padding: SPACING.xl,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        elevation: 2,
    },
    questionLabel: { fontSize: SIZES.medium, color: COLORS.textSecondary, marginBottom: SPACING.md },
    arabicText: { ...arabicStyle(48), color: COLORS.text, textAlign: 'center' },
    englishPrompt: { fontSize: SIZES.xlarge, color: COLORS.text, textAlign: 'center' },
    optionsContainer: { flex: 1 },
    optionButton: { backgroundColor: COLORS.cardBackground, padding: SPACING.lg, borderRadius: 12, marginBottom: SPACING.md, elevation: 2 },
    correctOption: { backgroundColor: COLORS.success },
    wrongOption: { backgroundColor: COLORS.error },
    optionText: { fontSize: SIZES.large, color: COLORS.text, textAlign: 'center' },
    arabicOptionText: { ...arabicStyle(28), color: COLORS.text, textAlign: 'center' },
    nextButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: 12, alignItems: 'center', marginTop: SPACING.md },
    nextButtonText: { color: '#FFFFFF', fontSize: SIZES.large, fontWeight: 'bold' },
    resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    resultTitle: { fontSize: SIZES.xxlarge, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg },
    resultScore: { fontSize: 48, fontWeight: 'bold', color: COLORS.primary },
    resultPercentage: { fontSize: SIZES.xlarge, color: COLORS.textSecondary, marginBottom: SPACING.md },
    restartButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, borderRadius: 12, marginTop: SPACING.md },
    secondaryButton: { backgroundColor: COLORS.textSecondary },
    restartButtonText: { color: '#FFFFFF', fontSize: SIZES.large, fontWeight: 'bold' },
});
