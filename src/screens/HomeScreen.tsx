import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type SettingsScreenProps = {
  onOpenPrivacy: () => void;
};

export default function SettingsScreen({ onOpenPrivacy }: SettingsScreenProps) {
  const [referenceScaleEnabled, setReferenceScaleEnabled] = useState(true);
  const [saveHistoryEnabled, setSaveHistoryEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Local-first preferences</Text>

          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={styles.label}>Use reference scale</Text>
              <Text style={styles.subLabel}>
                Use a known object such as a credit card or marker for calibration.
              </Text>
            </View>
            <Switch
              value={referenceScaleEnabled}
              onValueChange={setReferenceScaleEnabled}
              trackColor={{ false: '#334155', true: '#2563eb' }}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.textWrap}>
              <Text style={styles.label}>Save measurement history</Text>
              <Text style={styles.subLabel}>Store locally in encrypted device storage.</Text>
            </View>
            <Switch
              value={saveHistoryEnabled}
              onValueChange={setSaveHistoryEnabled}
              trackColor={{ false: '#334155', true: '#2563eb' }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <TouchableOpacity style={styles.button} onPress={onOpenPrivacy}>
            <Text style={styles.buttonText}>Open Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary}>
            <Text style={styles.buttonSecondaryText}>Camera Usage Notice</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Camera access is only for local dimension analysis. Raw frames are not transmitted by
            default unless the user explicitly opts in.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#08111f',
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#0b1422',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#23314d',
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  textWrap: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  subLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  buttonSecondary: {
    backgroundColor: '#1c2d49',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSecondaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  disclaimer: {
    color: '#fbbf24',
    fontSize: 12,
    lineHeight: 18,
  },
});
