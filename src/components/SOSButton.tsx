import React, { useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '../constants';
import { useAppStore } from '../store/appStore';
import { useContactsStore } from '../store/contactsStore';
import { getCurrentLocation } from '../services/locationService';
import { sendSOSMessage, triggerSOSHaptic } from '../services/sosService';
import { SOS_HOLD_DURATION_MS, SOS_CANCEL_WINDOW_MS } from '../constants';

export const SOSButton: React.FC = () => {
  const { sosStatus, setSosStatus, setCurrentLocation } = useAppStore();
  const { contacts } = useContactsStore();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  const handleSOS = useCallback(async () => {
    if (contacts.length === 0) {
      Alert.alert(
        '緊急連絡先が未登録です',
        '設定画面から緊急連絡先を登録してください。'
      );
      setSosStatus('idle');
      stopPulse();
      return;
    }

    setSosStatus('sending');

    const location = await getCurrentLocation();
    if (location) {
      setCurrentLocation(location);
    }

    const success = await sendSOSMessage(contacts, location);

    if (success) {
      setSosStatus('sent');
      Alert.alert('SOS送信完了', '緊急連絡先にメッセージを送信しました。');
    } else {
      Alert.alert('送信失敗', 'メッセージの送信に失敗しました。直接電話してください。');
    }

    setTimeout(() => {
      setSosStatus('idle');
      stopPulse();
    }, 3000);
  }, [contacts, setSosStatus, setCurrentLocation, stopPulse]);

  const onPressIn = useCallback(() => {
    triggerSOSHaptic();
    startPulse();
    setSosStatus('confirming');

    holdTimer.current = setTimeout(() => {
      setSosStatus('confirming');
      cancelTimer.current = setTimeout(() => {
        handleSOS();
      }, SOS_CANCEL_WINDOW_MS);
    }, SOS_HOLD_DURATION_MS);
  }, [handleSOS, setSosStatus, startPulse]);

  const onPressOut = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }

    if (sosStatus === 'confirming') {
      if (cancelTimer.current) {
        clearTimeout(cancelTimer.current);
        cancelTimer.current = null;
      }
      setSosStatus('idle');
      stopPulse();
    }
  }, [sosStatus, setSosStatus, stopPulse]);

  const onConfirmSOS = useCallback(() => {
    if (cancelTimer.current) {
      clearTimeout(cancelTimer.current);
      cancelTimer.current = null;
    }
    handleSOS();
  }, [handleSOS]);

  const onCancelSOS = useCallback(() => {
    if (cancelTimer.current) {
      clearTimeout(cancelTimer.current);
      cancelTimer.current = null;
    }
    setSosStatus('idle');
    stopPulse();
  }, [setSosStatus, stopPulse]);

  const getButtonContent = () => {
    switch (sosStatus) {
      case 'confirming':
        return (
          <View style={styles.confirmContainer}>
            <Text style={styles.confirmText}>SOSを送信しますか？</Text>
            <View style={styles.confirmButtons}>
              <Pressable
                style={[styles.confirmBtn, styles.confirmYes]}
                onPress={onConfirmSOS}
              >
                <Text style={styles.confirmBtnText}>送信する</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, styles.confirmNo]}
                onPress={onCancelSOS}
              >
                <Text style={styles.confirmBtnText}>キャンセル</Text>
              </Pressable>
            </View>
          </View>
        );
      case 'sending':
        return <Text style={styles.buttonText}>送信中...</Text>;
      case 'sent':
        return <Text style={styles.buttonText}>送信完了 ✓</Text>;
      default:
        return (
          <>
            <Text style={styles.buttonText}>SOS</Text>
            <Text style={styles.buttonSubText}>長押しで発動</Text>
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.outerRing, { transform: [{ scale: pulseAnim }] }]}
      >
        <Pressable
          style={[
            styles.button,
            sosStatus === 'sent' && styles.buttonSent,
          ]}
          onLongPress={onConfirmSOS}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          delayLongPress={SOS_HOLD_DURATION_MS}
          accessibilityLabel="SOSボタン"
          accessibilityHint="長押しして緊急連絡先にSOSメッセージを送信します"
        >
          {getButtonContent()}
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonSent: {
    backgroundColor: COLORS.success,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '900',
    letterSpacing: 4,
  },
  buttonSubText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  confirmContainer: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  confirmText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  confirmBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  confirmYes: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  confirmNo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
});
