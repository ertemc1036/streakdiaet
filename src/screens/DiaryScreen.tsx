import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { useAppData } from '../context/AppDataContext';
import { colors } from '../theme';
import { todayKey } from '../utils/date';
import type { TabScreenProps } from '../navigation/types';
import type { Meal, WaterEntry } from '../types';

type Props = TabScreenProps<'Diary'>;

type Row =
  | { kind: 'meal'; data: Meal }
  | { kind: 'water'; data: WaterEntry };

export function DiaryScreen({ navigation }: Props) {
  const { todayMeals, water, removeMeal, removeWater } = useAppData();
  const today = todayKey();
  const todayWater = water.filter((w) => w.date === today);

  const rows: Row[] = [
    ...todayMeals.map((m): Row => ({ kind: 'meal', data: m })),
    ...todayWater.map((w): Row => ({ kind: 'water', data: w })),
  ].sort((a, b) => b.data.id.localeCompare(a.data.id));

  return (
    <View style={styles.screen}>
      <FlatList
        data={rows}
        keyExtractor={(row) => `${row.kind}-${row.data.id}`}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text style={styles.title}>Heute</Text>}
        ListEmptyComponent={
          <Text style={styles.empty}>Noch nichts eingetragen. Leg los! 🔥</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.row}>
            {item.kind === 'meal' ? (
              <>
                <Ionicons name="restaurant" size={22} color={colors.primary} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{item.data.name}</Text>
                  <Text style={styles.rowSubtitle}>
                    {item.data.calories} kcal · P {item.data.protein}g · K {item.data.carbs}g · F{' '}
                    {item.data.fat}g
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeMeal(item.data.id)}>
                  <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="water" size={22} color="#4FA3FF" />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>Wasser</Text>
                  <Text style={styles.rowSubtitle}>{item.data.ml} ml</Text>
                </View>
                <TouchableOpacity onPress={() => removeWater(item.data.id)}>
                  <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </>
            )}
          </Card>
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddMeal')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12, paddingBottom: 100 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 8 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  rowText: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  rowSubtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
