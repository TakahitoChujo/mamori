import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { useAppStore } from '../store/appStore';
import { useContactsStore } from '../store/contactsStore';
import { getCurrentLocation } from '../services/locationService';
import { sendSOSMessage } from '../services/sosService';

export const ReturnTimerCard: React.FC = () => {
  const { returnTimer, startReturnTimer, stopReturnTimer, setReturnTimer } =
    useAppStore();
  const { contacts } = useContactsStore();
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!returnTimer.isActive || !returnTimer.startedAt) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - returnTimer.startedAt!) / 1000;
      const total = returnTimer.durationMinutes * 60;
      const remaining = Math.max(0, total - elapsed);
      setRemainingSeconds(Math.ceil(remaining));

      if (remaining <= 0) {
        handleTimerExpired();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [returnTimer.isActive, returnTimer.startedAt, returnTimer.durationMinutes]);

  const handleTimerExpired = useCallback(async () => {
    Alert.alert(
      '帰宅確認',
      '無事に到着しましたか？',
      [
        {
          text: '到着しました',
          onPress: () => stopReturnTimer(),
        },
        {
          text: 'SOSを送信',
          style: 'destructive',
          onPress: async () => {
            const location = await getCurrentLocation();
            await sendSOSMessage(contacts, location);
            stopReturnTimer();
          },
        },
      ],
      { cancelable: false }
    );
  }, [contacts, stopReturnTimer]);

  const handleToggle = useCallback(() => {
    if (returnTimer.isActive) {
      stopReturnTimer();
    } else {
      if (contacts.length === 0) {
        Alert.alert(
          '緊急連絡先が未登録です',
          '設定画面から緊急連絡先を登録してください。'
        );
        return;
      }
      startReturnTimer();
    }
  }, [returnTimer.isActive, contacts, startReturnTimer, stopReturnTimer]);

  const adjustTime = useCallback(
    (delta: number) => {
      if (returnTimer.isActive) return;
      const newDuration = Math.max(
        5,
        Math.min(120, returnTimer.durationMinutes + delta)
      );
      setReturnTimer({ durationMinutes: newDuration });
    },
    [returnTimer.isActive, returnTimer.durationMinutes, setReturnTimer]
  );

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>帰宅タイマー</Text>
      <Text style={styles.description}>
        設定時間内に到着確認がない場合、緊急連絡先に通知します
      </Text>

      {returnTimer.isActive ? (
        <View style={styles.timerDisplay}>
          <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
          <Text style={styles.timerLabel}>残り時間</Text>
        </View>
      ) : (
        <View style={styles.durationSelector}>
          <Pressable
            style={styles.adjustButton}
            onPress={() => adjustTime(-5)}
          >
            <Text style={styles.adjustText}>-5</Text>
          </Pressable>
          <Text style={styles.durationText}>
            {returnTimer.durationMinutes}分
          </Text>
          <Pressable
            style={styles.adjustButton}
            onPress={() => adjustTime(5)}
          >
            <Text style={styles.adjustText}>+5</Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={[styles.toggleButton, returnTimer.isActive && styles.stopButton]}
        onPress={handleToggle}
      >
        <Text style={styles.toggleText}>
          {returnTimer.isActive ? '到着しました' : 'タイマー開始'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.lg,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  timerText: {
    color: COLORS.warning,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  durationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.lg,
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  durationText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    minWidth: 80,
    textAlign: 'center',
  },
  toggleButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: COLORS.success,
  },
  toggleText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
