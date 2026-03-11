import React, { useCallback } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { useAppStore } from '../store/appStore';
import {
  scheduleFakeCall,
  cancelFakeCall,
} from '../services/fakeCallService';

interface Props {
  onFakeCallRing: () => void;
}

export const FakeCallButton: React.FC<Props> = ({ onFakeCallRing }) => {
  const { fakeCallStatus, setFakeCallStatus, fakeCallConfig } = useAppStore();
  const isActive = fakeCallStatus !== 'idle';

  const handlePress = useCallback(() => {
    if (isActive) {
      cancelFakeCall();
      setFakeCallStatus('idle');
    } else {
      setFakeCallStatus('scheduled');
      scheduleFakeCall(fakeCallConfig, () => {
        onFakeCallRing();
      });
    }
  }, [isActive, setFakeCallStatus, fakeCallConfig, onFakeCallRing]);

  const getLabel = () => {
    switch (fakeCallStatus) {
      case 'scheduled':
        return `${fakeCallConfig.delaySeconds}秒後に着信`;
      case 'ringing':
        return '着信中...';
      case 'answered':
        return '通話中...';
      default:
        return 'フェイク着信';
    }
  };

  return (
    <Pressable
      style={[styles.button, isActive && styles.buttonActive]}
      onPress={handlePress}
      accessibilityLabel="フェイクコール"
      accessibilityHint="タップして偽の電話着信を発生させます"
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{isActive ? '📞' : '📱'}</Text>
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {getLabel()}
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
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
    color: COLORS.white,
  },
});
