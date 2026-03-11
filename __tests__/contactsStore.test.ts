import { useContactsStore } from '../src/store/contactsStore';

// Mock secureStorage
jest.mock('../src/utils/secureStorage', () => ({
  secureSetItem: jest.fn().mockResolvedValue(undefined),
  secureGetItem: jest.fn().mockResolvedValue(null),
  secureDeleteItem: jest.fn().mockResolvedValue(undefined),
}));

import { secureSetItem, secureGetItem } from '../src/utils/secureStorage';

describe('contactsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useContactsStore.setState({ contacts: [], isLoaded: false });
  });

  describe('addContact', () => {
    it('adds a contact successfully', async () => {
      const result = await useContactsStore.getState().addContact({
        name: 'テスト太郎',
        phoneNumber: '09012345678',
        relationship: '友人',
      });

      expect(result).toBe(true);
      expect(useContactsStore.getState().contacts).toHaveLength(1);
      expect(useContactsStore.getState().contacts[0].name).toBe('テスト太郎');
    });

    it('generates unique ID for each contact', async () => {
      await useContactsStore.getState().addContact({
        name: 'Contact 1',
        phoneNumber: '09011111111',
        relationship: '家族',
      });
      await useContactsStore.getState().addContact({
        name: 'Contact 2',
        phoneNumber: '09022222222',
        relationship: '友人',
      });

      const contacts = useContactsStore.getState().contacts;
      expect(contacts[0].id).not.toBe(contacts[1].id);
    });

    it('rejects when at max capacity (2 for free plan)', async () => {
      await useContactsStore.getState().addContact({
        name: 'Contact 1',
        phoneNumber: '09011111111',
        relationship: '家族',
      });
      await useContactsStore.getState().addContact({
        name: 'Contact 2',
        phoneNumber: '09022222222',
        relationship: '友人',
      });

      const result = await useContactsStore.getState().addContact({
        name: 'Contact 3',
        phoneNumber: '09033333333',
        relationship: '同僚',
      });

      expect(result).toBe(false);
      expect(useContactsStore.getState().contacts).toHaveLength(2);
    });

    it('persists contacts to secure storage', async () => {
      await useContactsStore.getState().addContact({
        name: 'テスト',
        phoneNumber: '09012345678',
        relationship: '家族',
      });

      expect(secureSetItem).toHaveBeenCalledWith(
        'mamori_contacts',
        expect.any(String)
      );
    });
  });

  describe('removeContact', () => {
    it('removes a contact by ID', async () => {
      await useContactsStore.getState().addContact({
        name: 'To Remove',
        phoneNumber: '09099999999',
        relationship: '友人',
      });

      const contactId = useContactsStore.getState().contacts[0].id;
      await useContactsStore.getState().removeContact(contactId);

      expect(useContactsStore.getState().contacts).toHaveLength(0);
    });
  });

  describe('updateContact', () => {
    it('updates contact fields', async () => {
      await useContactsStore.getState().addContact({
        name: 'Before',
        phoneNumber: '09012345678',
        relationship: '友人',
      });

      const contactId = useContactsStore.getState().contacts[0].id;
      await useContactsStore.getState().updateContact(contactId, {
        name: 'After',
      });

      expect(useContactsStore.getState().contacts[0].name).toBe('After');
      expect(useContactsStore.getState().contacts[0].phoneNumber).toBe('09012345678');
    });
  });

  describe('loadContacts', () => {
    it('loads contacts from secure storage', async () => {
      const storedContacts = [
        { id: '1', name: 'Stored', phoneNumber: '09012345678', relationship: '家族' },
      ];
      (secureGetItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(storedContacts)
      );

      await useContactsStore.getState().loadContacts();

      expect(useContactsStore.getState().contacts).toEqual(storedContacts);
      expect(useContactsStore.getState().isLoaded).toBe(true);
    });

    it('handles empty storage gracefully', async () => {
      (secureGetItem as jest.Mock).mockResolvedValueOnce(null);

      await useContactsStore.getState().loadContacts();

      expect(useContactsStore.getState().contacts).toEqual([]);
      expect(useContactsStore.getState().isLoaded).toBe(true);
    });
  });
});
