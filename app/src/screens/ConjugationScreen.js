import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, SPACING, arabicStyle } from '../constants/theme';
import conjugation from '../data/conjugation.json';
import { buildConjugationDrill } from '../utils/conjugation';
import { recordQuiz } from '../utils/game';
import RewardBanner from '../components/RewardBanner';

const Segment = ({ options, value, onChange }) => (
    <View style={styles.segment}>
        {options.map((o) => (
            <TouchableOpacity
                key={o.value}
                style={[styles.segmentButton, value === o.value && styles.segmentActive]}
                onPress={() => onChange(o.value)}
            >
                <Text style={[styles.segmentText, value === o.value && styles.segmentTextActive]}>{o.label}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

function TableView({ gender }) {
    const g = conjugation[gender];
    return (
        <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.note}>
                Sample verb فَعَلَ "to do". Every regular verb follows this pattern (from the PDF, pp. 35-38).
            </Text>

            <Text style={styles.sectionTitle}>Past & present</Text>
            {g.active.map((r) => (
                <View key={r.pronoun + r.past} style={styles.row}>
                    <Text style={styles.pronoun}>{r.pronoun}</Text>
                    <View style={styles.cell}>
                        <Text style={styles.arabic}>{r.past}</Text>
                        <Text style={styles.english}>{r.pastEn}</Text>
                    </View>
                    <View style={styles.cell}>
                        <Text style={styles.arabic}>{r.present}</Text>
                        <Text style={styles.english}>{r.presentEn}</Text>
                    </View>
                </View>
            ))}

            <Text style={styles.sectionTitle}>Commands</Text>
            {g.imperative.map((r) => {
                const negative = g.negativeImperative.find((n) => n.number === r.number);
                return (
                    <View key={r.ar} style={styles.row}>
                        <Text style={styles.pronoun}>{r.number}</Text>
                        <View style={styles.cell}>
                            <Text style={styles.arabic}>{r.ar}</Text>
                            <Text style={styles.english}>{r.en}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.arabic}>{negative.ar}</Text>
                            <Text style={styles.english}>{negative.en}</Text>
                        </View>
                    </View>
                );
            })}

            <Text style={styles.sectionTitle}>Passive voice (مجهول)</Text>
            <View style={styles.row}>
                <View style={styles.cell}>
                    <Text style={styles.arabic}>{g.passive.past}</Text>
                    <Text style={styles.english}>{g.passive.pastEn}</Text>
                </View>
                <View style={styles.cell}>
                    <Text style={styles.arabic}>{g.passive.present}</Text>
                    <Text style={styles.english}>{g.passive.presentEn}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Participles & verbal noun</Text>
            {[['Active (doer)', g.participles.active], ['Passive (affected)', g.participles.passive]].map(([label, p]) => (
                <View key={label} style={styles.block}>
                    <Text style={styles.english}>{label}</Text>
                    <Text style={styles.arabic}>{p.singular}</Text>
                    <Text style={styles.arabicSmall}>{p.dual}</Text>
                    <Text style={styles.arabicSmall}>{p.plural}</Text>
                </View>
            ))}
            <View style={styles.block}>
                <Text style={styles.english}>Verbal noun: {g.verbalNoun.en}</Text>
                <Text style={styles.arabic}>{g.verbalNoun.ar}</Text>
            </View>
        </ScrollView>
    );
}

function Drill() {
    const [questions, setQuestions] = useState(() => buildConjugationDrill(conjugation));
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [picked, setPicked] = useState(null);
    const [reward, setReward] = useState(null);
    const [done, setDone] = useState(false);

    const q = questions[index];

    const next = async () => {
        if (index < questions.length - 1) {
            setIndex(index + 1);
            setPicked(null);
        } else {
            setReward(await recordQuiz(score, questions.length));
            setDone(true);
        }
    };

    const restart = () => {
        setQuestions(buildConjugationDrill(conjugation));
        setIndex(0);
        setScore(0);
        setPicked(null);
        setReward(null);
        setDone(false);
    };

    if (done) {
        return (
            <View style={styles.center}>
                <Text style={styles.sectionTitle}>Drill complete</Text>
                <Text style={styles.score}>{score} / {questions.length}</Text>
                <RewardBanner result={reward} />
                <TouchableOpacity style={styles.primaryButton} onPress={restart}>
                    <Text style={styles.primaryButtonText}>Drill again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.body}>
            <Text style={styles.note}>Question {index + 1} / {questions.length} · Score {score}</Text>
            <View style={styles.questionCard}>
                <Text style={styles.english}>{q.gender === 'masculine' ? 'Masculine' : 'Feminine'} · {q.tense}</Text>
                <Text style={styles.bigArabic}>{q.pronoun}</Text>
                <Text style={styles.english}>"{q.meaning}"</Text>
            </View>
            {q.options.map((option) => {
                const isAnswer = option === q.answer;
                const isPicked = option === picked;
                return (
                    <TouchableOpacity
                        key={option}
                        disabled={picked !== null}
                        style={[
                            styles.option,
                            picked !== null && isAnswer && styles.correct,
                            isPicked && !isAnswer && styles.wrong,
                        ]}
                        onPress={() => {
                            setPicked(option);
                            if (isAnswer) setScore(score + 1);
                        }}
                    >
                        <Text style={styles.arabic}>{option}</Text>
                    </TouchableOpacity>
                );
            })}
            {picked !== null && (
                <TouchableOpacity style={styles.primaryButton} onPress={next}>
                    <Text style={styles.primaryButtonText}>{index < questions.length - 1 ? 'Next' : 'See results'}</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

export default function ConjugationScreen() {
    const [mode, setMode] = useState('table');
    const [gender, setGender] = useState('masculine');

    return (
        <View style={styles.container}>
            <Segment
                value={mode}
                onChange={setMode}
                options={[{ value: 'table', label: 'Table' }, { value: 'drill', label: 'Drill' }]}
            />
            {mode === 'table' && (
                <Segment
                    value={gender}
                    onChange={setGender}
                    options={[{ value: 'masculine', label: 'Masculine مُذَكَّر' }, { value: 'feminine', label: 'Feminine مُؤَنَّث' }]}
                />
            )}
            {mode === 'table' ? <TableView gender={gender} /> : <Drill />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    body: { padding: SPACING.md, paddingBottom: SPACING.xl },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg },
    segment: {
        flexDirection: 'row',
        margin: SPACING.md,
        marginBottom: 0,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        padding: 3,
    },
    segmentButton: { flex: 1, paddingVertical: SPACING.sm, borderRadius: 8, alignItems: 'center' },
    segmentActive: { backgroundColor: COLORS.primary },
    segmentText: { fontSize: SIZES.medium, color: COLORS.text },
    segmentTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
    note: { fontSize: SIZES.small, color: COLORS.textSecondary, marginBottom: SPACING.sm },
    sectionTitle: { fontSize: SIZES.large, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.sm },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 10,
        padding: SPACING.sm,
        marginBottom: SPACING.xs,
    },
    pronoun: { width: 64, fontSize: SIZES.large, color: COLORS.primary, textAlign: 'center' },
    cell: { flex: 1, alignItems: 'center' },
    arabic: { ...arabicStyle(24), color: COLORS.text, textAlign: 'center' },
    arabicSmall: { ...arabicStyle(20), color: COLORS.text, textAlign: 'center' },
    bigArabic: { ...arabicStyle(44), color: COLORS.primary, marginVertical: SPACING.sm },
    english: { fontSize: SIZES.small, color: COLORS.textSecondary, textAlign: 'center' },
    block: { backgroundColor: COLORS.cardBackground, borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.xs, alignItems: 'center' },
    questionCard: { backgroundColor: COLORS.cardBackground, borderRadius: 12, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md, elevation: 2 },
    option: { backgroundColor: COLORS.cardBackground, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.sm, elevation: 1 },
    correct: { backgroundColor: COLORS.success },
    wrong: { backgroundColor: COLORS.error },
    score: { fontSize: 48, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md },
    primaryButton: { backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl, borderRadius: 12, alignItems: 'center', marginTop: SPACING.md },
    primaryButtonText: { color: '#FFFFFF', fontSize: SIZES.large, fontWeight: 'bold' },
});
