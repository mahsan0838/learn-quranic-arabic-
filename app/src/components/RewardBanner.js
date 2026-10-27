import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../constants/theme';

// Describes what a reward result (from utils/game.js) unlocked.
export const rewardLines = (result) => {
  if (!result) return [];
  const lines = [`+${result.xpGained} XP`];
  if (result.goalReached) lines.push('🎉 Daily goal reached! Bonus XP');
  if (result.leveledUp) lines.push(`⬆️ Level ${result.level}!`);
  result.newBadges.forEach((b) => lines.push(`${b.icon} Badge: ${b.title}`));
  return lines;
};

export default function RewardBanner({ result }) {
  const lines = rewardLines(result);
  if (lines.length === 0) return <View style={styles.spacer} />;
  return (
    <View style={styles.banner}>
      {lines.map((line) => (
        <Text key={line} style={styles.text}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  spacer: { height: 28 },
  banner: {
    alignSelf: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  text: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '700',
    textAlign: 'center',
  },
});
