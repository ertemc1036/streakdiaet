import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Card } from '../components/Card';
import { WeightChart } from '../components/WeightChart';
import { useAppData } from '../context/AppDataContext';
import { formatDisplayDate } from '../utils/date';
import { colors } from '../theme';

export function ProgressScreen() {
  const { weights, addWeight } = useAppData();
  const { width } = useWindowDimensions();
  const [input, setInput] = useState('');

  const sorted = [...weights].sort((a, b) => b.date.localeCompare(a.date));

  function handleAdd() {
    const kg = Number(input.replace(',', '.'));
    if (!kg || kg <= 0) return;
    addWeight(kg);
    setInput('');
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={sorted}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Fortschritt</Text>
          <Card>
            <WeightChart entries={weights} width={width - 72} />
          </Card>
          <Card style={styles.addRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              keyboardType="decimal-pad"
              placeholder="Gewicht in kg"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.addButtonText}>Eintragen</Text>
            </TouchableOpacity>
          </Card>
          <Text style={styles.subtitle}>Verlauf</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Noch keine Einträge.</Text>}
      renderItem={({ item }) => (
        <Card style={styles.historyRow}>
          <Text style={styles.historyDate}>{formatDisplayDate(item.date)}</Text>
          <Text style={styles.historyValue}>{item.kg} kg</Text>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12, paddingBottom: 60 },
  header: { gap: 16, marginBottom: 4 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700' },
  subtitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: 4 },
  addRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: { color: '#fff', fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 20 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  historyDate: { color: colors.textMuted },
  historyValue: { color: colors.text, fontWeight: '600' },
});
