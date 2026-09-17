import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { useAppData } from '../context/AppDataContext';
import { analyzeMealPhoto, isAiConfigured } from '../services/aiMealAnalysis';
import { colors } from '../theme';
import type { RootScreenProps } from '../navigation/types';

type Props = RootScreenProps<'AddMeal'>;

export function AddMealScreen({ navigation }: Props) {
  const { addMeal } = useAppData();
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [analyzing, setAnalyzing] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [source, setSource] = useState<'manual' | 'ai'>('manual');

  async function pickImage(useCamera: boolean) {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ base64: true, quality: 0.6 })
      : await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.6 });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setPhotoUri(asset.uri);

    if (isAiConfigured() && asset.base64) {
      setAnalyzing(true);
      const mimeType = asset.mimeType ?? 'image/jpeg';
      const analysis = await analyzeMealPhoto(asset.base64, mimeType);
      setAnalyzing(false);
      if (analysis) {
        setName(analysis.name);
        setCalories(String(analysis.calories));
        setProtein(String(analysis.protein));
        setCarbs(String(analysis.carbs));
        setFat(String(analysis.fat));
        setSource('ai');
      }
    }
  }

  function handleSave() {
    if (!name.trim() || !calories) return;
    addMeal({
      name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      photoUri,
      source,
    });
    navigation.goBack();
  }

  const canSave = name.trim().length > 0 && calories.length > 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : (
        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(true)}>
            <Ionicons name="camera" size={28} color={colors.primary} />
            <Text style={styles.photoButtonText}>Foto aufnehmen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(false)}>
            <Ionicons name="images" size={28} color={colors.primary} />
            <Text style={styles.photoButtonText}>Aus Galerie</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isAiConfigured() && (
        <Text style={styles.hint}>
          Foto-Analyse ist nicht konfiguriert. Trag die Werte unten manuell ein.
        </Text>
      )}

      {analyzing && (
        <View style={styles.analyzing}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.hint}>Analysiere Mahlzeit …</Text>
        </View>
      )}

      <Card style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="z. B. Hähnchen mit Reis"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Kalorien (kcal)</Text>
        <TextInput
          style={styles.input}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.macroRow}>
          <View style={styles.macroField}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.macroField}>
            <Text style={styles.label}>Kohlenh. (g)</Text>
            <TextInput
              style={styles.input}
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.macroField}>
            <Text style={styles.label}>Fett (g)</Text>
            <TextInput
              style={styles.input}
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>
      </Card>

      <TouchableOpacity
        style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!canSave}
      >
        <Text style={styles.saveButtonText}>Speichern</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 60 },
  photoButtons: { flexDirection: 'row', gap: 12 },
  photoButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  photoButtonText: { color: colors.text, fontWeight: '600' },
  preview: { width: '100%', height: 220, borderRadius: 16 },
  hint: { color: colors.textMuted, fontSize: 13 },
  analyzing: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  form: { gap: 6 },
  label: { color: colors.textMuted, fontSize: 13, marginTop: 8 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 15,
  },
  macroRow: { flexDirection: 'row', gap: 10 },
  macroField: { flex: 1 },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
