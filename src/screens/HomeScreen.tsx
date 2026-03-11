import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Modal, SafeAreaView, Text } from 'react-native';
import { COLORS, SPACING, APP_NAME, FONT_SIZE } from '../constants';
import { SOSButton } from '../components/SOSButton';
import { BuzzerButton } from '../components/BuzzerButton';
import { FakeCallButton } from '../components/FakeCallButton';
import { ReturnTimerCard } from '../components/ReturnTimerCard';
import { FakeCallScreen } from './FakeCallScreen';
import { useAppStore } from '../store/appStore';
import { useContactsStore } from '../store/contactsStore';
import { requestLocationPermission } from '../services/locationService';

export const HomeScreen: React.FC = () => {
  const [showFakeCall, setShowFakeCall] = useState(false);
  const { setFakeCallStatus } = useAppStore();
  const { loadContacts } = useContactsStore();

  useEffect(() => {
    loadContacts();
    requestLocationPermission();
  }, []);

  const handleFakeCallRing = useCallback(() => {
    setFakeCallStatus('ringing');
    setShowFakeCall(true);
  }, [setFakeCallStatus]);

  const handleDismissFakeCall = useCallback(() => {
    setShowFakeCall(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.appTitle}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>あなたの安全を守ります</Text>

        <View style={styles.sosSection}>
          <SOSButton />
        </View>

        <View style={styles.quickActions}>
          <BuzzerButton />
          <FakeCallButton onFakeCallRing={handleFakeCallRing} />
        </View>

        <ReturnTimerCard />
      </ScrollView>

      <Modal
        visible={showFakeCall}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <FakeCallScreen onDismiss={handleDismissFakeCall} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  appTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 6,
    marginTop: SPACING.md,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  sosSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
});
