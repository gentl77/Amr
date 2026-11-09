import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>DimensionMass AI Privacy Policy</Text>

          <Text style={styles.text}>
            DimensionMass AI uses the device camera only to estimate dimensions, surface area,
            volume, density, and mass. By default, all processing occurs locally on the device.
            Visual data is not transmitted to external servers unless the user explicitly agrees.
          </Text>

          <Text style={styles.text}>
            Measurement history and local snapshots are stored in encrypted device storage. No
            personal identity data is required for the core measurement feature.
          </Text>

          <Text style={styles.text}>
            Camera access is requested only for dimension scanning. The permission prompt explains
            the purpose and users can decline access without affecting app installation.
          </Text>

          <Text style={styles.text}>
            If cloud lookup or analytics are added later, all communications must use HTTPS with
            TLS 1.3 and any secret API keys must be stored in secure environment variables or a
            secure secret manager, not in source code.
          </Text>

          <Text style={styles.heading}>Disclaimer / Terms</Text>

          <Text style={styles.text}>
            DimensionMass AI provides estimates based on camera geometry, reference scale, and
            physics formulas. Results are approximate and should be validated for industrial,
            manufacturing, legal, or safety-critical decisions.
          </Text>

          <Text style={styles.text}>
            This app is not a certified industrial measuring device and should not be used as the
            sole basis for legal, regulated, or safety-critical decisions.
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
  },
  heading: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    color: '#dbeafe',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});
