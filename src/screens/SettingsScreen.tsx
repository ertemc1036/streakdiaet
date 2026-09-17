import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/Card';
import { useAppData } from '../context/AppDataContext';
import { isAiConfigured } from '../services/aiMealAnalysis';
import { colors } from '../theme';

export function SettingsScreen() {
  const { settings, updateSettings, resetAllData } = useAppData();
  const [waterGoal, setWaterGoal] = useState(String(settings.waterGoalMl));
  const [calorieGoal, setCalorieGoal] = useState(String(settings.calorieGoal));

  function saveGoals() {
    updateSettings({
      waterGoalMl: Number(waterGoal) || settings.waterGoalMl,
      calorieGoal: Number(calorieGoal) || settings.calorieGoal,
    });
  }

  function confirmReset() {
    Alert.alert('Alle Daten löschen?', 'Das kann nicht rückgängig gemacht werden.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Löschen', style: 'destructive', onPress: resetAllData },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Einstellungen</Text>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Ziele</Text>
        <Text style={styles.label}>Tägliches Wasserziel (ml)</Text>
        <TextInput
          style={styles.input}
          value={waterGoal}
          onChangeText={setWaterGoal}
          keyboardType="numeric"
          onBlur={saveGoals}
        />
        <Text style={styles.label}>Tägliches Kalorienziel (kcal)</Text>
        <TextInput
          style={styles.input}
          value={calorieGoal}
          onChangeText={setCalorieGoal}
          keyboardType="numeric"
          onBlur={saveGoals}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveGoals}>
          <Text style={styles.saveButtonText}>Speichern</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Foto-Mahlzeitenanalyse</Text>
        <Text style={styles.label}>
          Status: {isAiConfigured() ? 'Aktiv' : 'Nicht konfiguriert'}
        </Text>
        <Text style={styles.hint}>
          Um die KI-Analyse zu aktivieren, setze EXPO_PUBLIC_ANTHROPIC_API_KEY in einer .env-Datei
          im Projektroot. Ohne Key kannst du Mahlzeiten weiterhin manuell eintragen.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Daten</Text>
        <TouchableOpacity style={styles.dangerButton} onPress={confirmReset}>
          <Text style={styles.dangerButtonText}>Alle Daten löschen</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700' },
  card: { gap: 8 },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  label: { color: colors.textMuted, fontSize: 13, marginTop: 6 },
  hint: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: { color: '#fff', fontWeight: '700' },
  dangerButton: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerButtonText: { color: colors.danger, fontWeight: '700' },
});
