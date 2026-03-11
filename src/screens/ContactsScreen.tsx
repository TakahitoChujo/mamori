import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants';
import { useContactsStore } from '../store/contactsStore';
import { EmergencyContact } from '../types';
import { MAX_EMERGENCY_CONTACTS_FREE } from '../constants';
import { sanitizePhoneNumber, isValidPhoneNumber } from '../utils/validation';

export const ContactsScreen: React.FC = () => {
  const { contacts, addContact, removeContact } = useContactsStore();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('エラー', '名前を入力してください');
      return;
    }

    const sanitized = sanitizePhoneNumber(phoneNumber);
    if (!isValidPhoneNumber(sanitized)) {
      Alert.alert('エラー', '有効な電話番号を入力してください');
      return;
    }

    const success = await addContact({
      name: name.trim(),
      phoneNumber: sanitized,
      relationship: relationship.trim() || '未設定',
    });

    if (success) {
      setName('');
      setPhoneNumber('');
      setRelationship('');
      setIsAdding(false);
    } else {
      Alert.alert(
        '登録上限',
        `無料プランでは最大${MAX_EMERGENCY_CONTACTS_FREE}件まで登録できます`
      );
    }
  }, [name, phoneNumber, relationship, addContact]);

  const handleRemove = useCallback(
    (contact: EmergencyContact) => {
      Alert.alert('削除確認', `${contact.name}を削除しますか？`, [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => removeContact(contact.id),
        },
      ]);
    },
    [removeContact]
  );

  const renderContact = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        <Text style={styles.contactRelation}>{item.relationship}</Text>
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={() => handleRemove(item)}
        accessibilityLabel={`${item.name}を削除`}
      >
        <Text style={styles.deleteText}>削除</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>緊急連絡先</Text>
          <Text style={styles.subtitle}>
            {contacts.length}/{MAX_EMERGENCY_CONTACTS_FREE}件登録済み
          </Text>
        </View>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContact}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>
                緊急連絡先が登録されていません
              </Text>
              <Text style={styles.emptySubText}>
                SOSボタン使用時にメッセージが送信されます
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

        {isAdding ? (
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              placeholder="名前"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="電話番号"
              placeholderTextColor={COLORS.textMuted}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="関係性（例：母、友人）"
              placeholderTextColor={COLORS.textMuted}
              value={relationship}
              onChangeText={setRelationship}
            />
            <View style={styles.formActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setIsAdding(false)}
              >
                <Text style={styles.cancelText}>キャンセル</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleAdd}>
                <Text style={styles.saveText}>保存</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          contacts.length < MAX_EMERGENCY_CONTACTS_FREE && (
            <Pressable
              style={styles.addButton}
              onPress={() => setIsAdding(true)}
            >
              <Text style={styles.addButtonText}>+ 連絡先を追加</Text>
            </Pressable>
          )
        )}
      </KeyboardAvoidingView>
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
  header: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  listContent: {
    flexGrow: 1,
  },
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
  },
  contactPhone: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: 2,
  },
  contactRelation: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  deleteButton: {
    backgroundColor: 'rgba(255,107,107,0.15)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  emptySubText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  addForm: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
  },
  formActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
