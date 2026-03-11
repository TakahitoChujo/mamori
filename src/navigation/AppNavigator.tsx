import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, StyleSheet } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS } from '../constants';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={[styles.icon, focused && styles.iconActive]}>{label}</Text>
);

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'ホーム',
            tabBarIcon: ({ focused }) => (
              <TabIcon label="🛡" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            tabBarLabel: '連絡先',
            tabBarIcon: ({ focused }) => (
              <TabIcon label="📋" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: '設定',
            tabBarIcon: ({ focused }) => (
              <TabIcon label="⚙️" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 88,
    paddingBottom: 28,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
});
