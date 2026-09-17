import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { useAppData } from '../context/AppDataContext';
import { colors } from '../theme';
import type { TabScreenProps } from '../navigation/types';

type Props = TabScreenProps<'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { streak, todayWaterMl, todayCalories, settings, addWater } = useAppData();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.streakRow}>
        <Ionicons name="flame" size={40} color={colors.primary} />
        <View>
          <Text style={styles.streakNumber}>{streak}</Text>
          <Text style={styles.streakLabel}>{streak === 1 ? 'Tag Streak' : 'Tage Streak'}</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Wasser</Text>
          <Text style={styles.cardValue}>
            {todayWaterMl} / {settings.waterGoalMl} ml
          </Text>
        </View>
        <ProgressBar progress={todayWaterMl / settings.waterGoalMl} />
        <View style={styles.quickAddRow}>
          <TouchableOpacity style={styles.quickAddButton} onPress={() => addWater(250)}>
            <Text style={styles.quickAddText}>+250 ml</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAddButton} onPress={() => addWater(500)}>
            <Text style={styles.quickAddText}>+500 ml</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Kalorien heute</Text>
          <Text style={styles.cardValue}>
            {todayCalories} / {settings.calorieGoal} kcal
          </Text>
        </View>
        <ProgressBar progress={todayCalories / settings.calorieGoal} />
      </Card>

      <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('AddMeal')}>
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.primaryButtonText}>Mahlzeit hinzufügen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  streakNumber: { color: colors.text, fontSize: 36, fontWeight: '700' },
  streakLabel: { color: colors.textMuted, fontSize: 14 },
  card: { gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  cardValue: { color: colors.textMuted, fontSize: 14 },
  quickAddRow: { flexDirection: 'row', gap: 10 },
  quickAddButton: {
    backgroundColor: colors.primaryMuted,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  quickAddText: { color: colors.primary, fontWeight: '600' },
  primaryButton: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
