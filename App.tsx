import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'settings' | 'privacy'>('home');

  return (
    <View style={{ flex: 1, backgroundColor: '#08111f' }}>
      {screen === 'home' && (
        <HomeScreen
          onOpenSettings={() => setScreen('settings')}
          onOpenPrivacy={() => setScreen('privacy')}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen onOpenPrivacy={() => setScreen('privacy')} />
      )}

      {screen === 'privacy' && <PrivacyPolicyScreen />}
    </View>
  );
}
