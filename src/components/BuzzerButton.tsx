import React, { useCallback } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { useAppStore } from '../store/appStore';
import { startBuzzer, stopBuzzer } from '../services/buzzerService';

export const BuzzerButton: React.FC = () => {
  const { buzzerStatus, setBuzzerStatus } = useAppStore();
  const isPlaying = buzzerStatus === 'playing';

  const handlePress = useCallback(async () => {
    if (isPlaying) {
      await stopBuzzer();
      setBuzzerStatus('idle');
    } else {
      setBuzzerStatus('playing');
      await startBuzzer();
    }
  }, [isPlaying, setBuzzerStatus]);

  return (
    <Pressable
      style={[styles.button, isPlaying && styles.buttonActive]}
      onPress={handlePress}
      accessibilityLabel="防犯ブザー"
      accessibilityHint="タップして防犯ブザーを鳴らします"
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{isPlaying ? '🔊' : '🔔'}</Text>
      </View>
      <Text style={[styles.label, isPlaying && styles.labelActive]}>
        {isPlaying ? 'ブザー停止' : '防犯ブザー'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  iconContainer: {
    marginBottom: SPACING.sm,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.black,
  },
});
