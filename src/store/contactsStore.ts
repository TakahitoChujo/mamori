import { create } from 'zustand';
import { EmergencyContact } from '../types';
import { MAX_EMERGENCY_CONTACTS_FREE } from '../constants';
import { secureSetItem, secureGetItem } from '../utils/secureStorage';

const STORAGE_KEY = 'mamori_contacts';

interface ContactsState {
  contacts: EmergencyContact[];
  isLoaded: boolean;
  addContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<boolean>;
  removeContact: (id: string) => Promise<void>;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => Promise<void>;
  loadContacts: () => Promise<void>;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  isLoaded: false,

  addContact: async (contact) => {
    const { contacts } = get();
    if (contacts.length >= MAX_EMERGENCY_CONTACTS_FREE) {
      return false;
    }
    const newContact: EmergencyContact = {
      ...contact,
      id: generateId(),
    };
    const updated = [...contacts, newContact];
    await secureSetItem(STORAGE_KEY, JSON.stringify(updated));
    set({ contacts: updated });
    return true;
  },

  removeContact: async (id) => {
    const updated = get().contacts.filter((c) => c.id !== id);
    await secureSetItem(STORAGE_KEY, JSON.stringify(updated));
    set({ contacts: updated });
  },

  updateContact: async (id, updates) => {
    const updated = get().contacts.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    await secureSetItem(STORAGE_KEY, JSON.stringify(updated));
    set({ contacts: updated });
  },

  loadContacts: async () => {
    try {
      const stored = await secureGetItem(STORAGE_KEY);
      if (stored) {
        set({ contacts: JSON.parse(stored), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },
}));
