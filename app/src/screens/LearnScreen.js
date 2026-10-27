import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, SIZES, SPACING } from '../constants/theme';
import { MODULE_IDS, HAS_URDU, getModule, meaningOf } from '../data/words';
import * as Speech from 'expo-speech';
import { saveProgress, getProgress } from '../utils/storage';
import useLanguage from '../hooks/useLanguage';

export default function LearnScreen({ route }) {
    const [moduleId, setModuleId] = useState(route?.params?.module ?? 1);
    const [selectedLanguage, setSelectedLanguage] = useLanguage();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [learned, setLearned] = useState({});

    // Home navigates here with a module param; follow it when it changes.
    useEffect(() => {
        if (route?.params?.module) setModuleId(route.params.module);
    }, [route?.params?.module]);

    useFocusEffect(
        useCallback(() => {
            getProgress().then(setLearned);
        }, [])
    );

    const moduleData = getModule(moduleId);

    const playPronunciation = async (arabicText) => {
        try {
            setIsSpeaking(true);
            await Speech.speak(arabicText, {
                language: 'ar', // Arabic
                pitch: 1.0,
                rate: 0.75, // Slower for learning
                onDone: () => setIsSpeaking(false),
                onStopped: () => setIsSpeaking(false),
                onError: () => {
                    setIsSpeaking(false);
                    Alert.alert('Error', 'Could not play pronunciation');
                },
            });
        } catch (error) {
            setIsSpeaking(false);
            console.error('TTS Error:', error);
        }
    };

    const markAsLearned = async (wordId) => {
        const success = await saveProgress(wordId, 'learned');
        if (success) {
            setLearned((prev) => ({ ...prev, [wordId]: { status: 'learned' } }));
        }
    };

    if (!moduleData || !moduleData.words || moduleData.words.length === 0) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={{ fontSize: 18, color: COLORS.text, textAlign: 'center' }}>
                    No vocabulary data available for this module.
                </Text>
                <Text style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 10, textAlign: 'center' }}>
                    Please add words to the vocab.json file.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.languageToggle}>
                    {MODULE_IDS.map((id) => (
                        <TouchableOpacity
                            key={id}
                            style={[styles.toggleButton, moduleId === id && styles.toggleButtonActive]}
                            onPress={() => setModuleId(id)}
                        >
                            <Text style={[styles.toggleText, moduleId === id && styles.toggleTextActive]}>
                                Module {id}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.headerTitle}>{moduleData.name}</Text>
                <Text style={styles.headerSubtitle}>{moduleData.description}</Text>

                {HAS_URDU && (
                <View style={styles.languageToggle}>
                    <TouchableOpacity
                        style={[styles.toggleButton, selectedLanguage === 'english' && styles.toggleButtonActive]}
                        onPress={() => setSelectedLanguage('english')}
                    >
                        <Text style={[styles.toggleText, selectedLanguage === 'english' && styles.toggleTextActive]}>
                            English
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, selectedLanguage === 'urdu' && styles.toggleButtonActive]}
                        onPress={() => setSelectedLanguage('urdu')}
                    >
                        <Text style={[styles.toggleText, selectedLanguage === 'urdu' && styles.toggleTextActive]}>
                            Urdu
                        </Text>
                    </TouchableOpacity>
                </View>
                )}
            </View>

            <ScrollView style={styles.wordList}>
                {moduleData.words.map((word) => (
                    <View key={word.id} style={styles.wordCard}>
                        <Text style={styles.arabicText}>{word.arabic}</Text>
                        <Text style={styles.meaningText}>
                            {meaningOf(word, selectedLanguage)}
                        </Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoText}>{word.grammatical_info}</Text>
                            {word.frequency != null && (
                                <Text style={styles.frequencyText}>Frequency: {word.frequency}</Text>
                            )}
                        </View>
                        {word.forms && (
                            <Text style={styles.formsText}>
                                {[word.forms.present, word.forms.imperative, word.forms.active_participle, word.forms.verbal_noun].join('   ')}
                            </Text>
                        )}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.ttsButton}
                                onPress={() => playPronunciation(word.arabic)}
                                disabled={isSpeaking}
                            >
                                <Text style={styles.ttsButtonText}>
                                    {isSpeaking ? '⏸️ Playing...' : '🔊 Play'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.learnedButton}
                                onPress={() => markAsLearned(word.id)}
                                disabled={!!learned[word.id]}
                            >
                                <Text style={styles.learnedButtonText}>
                                    {learned[word.id] ? '✓ Learned' : '✓ Mark as Learned'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    formsText: {
        fontSize: SIZES.large,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
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
        marginBottom: SPACING.xs,
    },
    headerSubtitle: {
        fontSize: SIZES.medium,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: SPACING.md,
    },
    languageToggle: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
        padding: 4,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: 6,
    },
    toggleButtonActive: {
        backgroundColor: '#FFFFFF',
    },
    toggleText: {
        color: '#FFFFFF',
        fontSize: SIZES.medium,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: COLORS.primary,
    },
    wordList: {
        flex: 1,
        padding: SPACING.md,
    },
    wordCard: {
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
    arabicText: {
        fontSize: 36,
        textAlign: 'center',
        marginBottom: SPACING.md,
        color: COLORS.text,
    },
    meaningText: {
        fontSize: SIZES.large,
        textAlign: 'center',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: SIZES.small,
        color: COLORS.textSecondary,
    },
    frequencyText: {
        fontSize: SIZES.small,
        color: COLORS.accent,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
        gap: SPACING.sm,
    },
    ttsButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    ttsButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.medium,
        fontWeight: '600',
    },
    learnedButton: {
        backgroundColor: COLORS.success,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    learnedButtonText: {
        color: '#FFFFFF',
        fontSize: SIZES.medium,
        fontWeight: '600',
    },
});
