import React, { useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import { useAppStore } from '../store/appStore';
import { startRinging, stopRinging } from '../services/fakeCallService';

interface Props {
  onDismiss: () => void;
}

export const FakeCallScreen: React.FC<Props> = ({ onDismiss }) => {
  const { fakeCallConfig, fakeCallStatus, setFakeCallStatus } = useAppStore();

  useEffect(() => {
    if (fakeCallStatus === 'ringing') {
      startRinging();
    }
    return () => {
      stopRinging();
    };
  }, [fakeCallStatus]);

  const handleAnswer = useCallback(() => {
    stopRinging();
    setFakeCallStatus('answered');
  }, [setFakeCallStatus]);

  const handleDecline = useCallback(() => {
    stopRinging();
    setFakeCallStatus('idle');
    onDismiss();
  }, [setFakeCallStatus, onDismiss]);

  const handleEndCall = useCallback(() => {
    setFakeCallStatus('idle');
    onDismiss();
  }, [setFakeCallStatus, onDismiss]);

  if (fakeCallStatus === 'answered') {
    return (
      <View style={styles.container}>
        <View style={styles.callInfo}>
          <Text style={styles.callerName}>{fakeCallConfig.callerName}</Text>
          <Text style={styles.callDuration}>通話中</Text>
        </View>
        <Pressable style={styles.endCallButton} onPress={handleEndCall}>
          <Text style={styles.endCallText}>終了</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.callInfo}>
        <Text style={styles.incomingLabel}>着信</Text>
        <Text style={styles.callerName}>{fakeCallConfig.callerName}</Text>
        <Text style={styles.phoneLabel}>携帯電話</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.declineButton} onPress={handleDecline}>
          <Text style={styles.actionIcon}>✕</Text>
          <Text style={styles.actionLabel}>拒否</Text>
        </Pressable>
        <Pressable style={styles.answerButton} onPress={handleAnswer}>
          <Text style={styles.actionIcon}>📞</Text>
          <Text style={styles.actionLabel}>応答</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: SPACING.xl,
  },
  callInfo: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  incomingLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
  },
  callerName: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxl,
    fontWeight: '300',
    marginBottom: SPACING.xs,
  },
  phoneLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  callDuration: {
    color: COLORS.success,
    fontSize: FONT_SIZE.lg,
    marginTop: SPACING.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 80,
  },
  declineButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
    position: 'absolute',
    bottom: -24,
  },
});
