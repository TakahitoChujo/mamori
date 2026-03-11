import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, APP_NAME } from '../constants';
import { useAppStore } from '../store/appStore';

export const SettingsScreen: React.FC = () => {
  const { fakeCallConfig, setFakeCallConfig } = useAppStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>設定</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>フェイクコール設定</Text>

          <View style={styles.settingRow}>
            <Text style={styles.label}>発信者名</Text>
            <TextInput
              style={styles.input}
              value={fakeCallConfig.callerName}
              onChangeText={(text) => setFakeCallConfig({ callerName: text })}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.label}>着信までの秒数</Text>
            <TextInput
              style={[styles.input, styles.numberInput]}
              value={String(fakeCallConfig.delaySeconds)}
              onChangeText={(text) => {
                const num = parseInt(text, 10);
                if (!isNaN(num) && num >= 1 && num <= 60) {
                  setFakeCallConfig({ delaySeconds: num });
                }
              }}
              keyboardType="number-pad"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリについて</Text>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>アプリ名</Text>
            <Text style={styles.aboutValue}>{APP_NAME}</Text>
          </View>
          <View style={styles.aboutItem}>
            <Text style={styles.aboutLabel}>バージョン</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
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
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    marginBottom: SPACING.lg,
  },
  settingRow: {
    marginBottom: SPACING.md,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  numberInput: {
    width: 80,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  aboutLabel: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  aboutValue: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
});
