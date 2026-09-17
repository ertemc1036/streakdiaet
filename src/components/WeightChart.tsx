import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { colors } from '../theme';
import type { WeightEntry } from '../types';

const HEIGHT = 160;
const PADDING = 16;

export function WeightChart({ entries, width }: { entries: WeightEntry[]; width: number }) {
  if (entries.length < 2) {
    return (
      <View style={[styles.empty, { width, height: HEIGHT }]}>
        <Text style={styles.emptyText}>
          Trag mindestens 2 Gewichtswerte ein, um deinen Verlauf zu sehen.
        </Text>
      </View>
    );
  }

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map((e) => e.kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const innerWidth = width - PADDING * 2;
  const innerHeight = HEIGHT - PADDING * 2;

  const points = sorted.map((entry, i) => {
    const x = PADDING + (i / (sorted.length - 1)) * innerWidth;
    const y = PADDING + innerHeight - ((entry.kg - min) / range) * innerHeight;
    return { x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View>
      <Svg width={width} height={HEIGHT}>
        <Line
          x1={PADDING}
          y1={HEIGHT - PADDING}
          x2={width - PADDING}
          y2={HEIGHT - PADDING}
          stroke={colors.border}
          strokeWidth={1}
        />
        <Polyline points={polylinePoints} fill="none" stroke={colors.primary} strokeWidth={2.5} />
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={colors.primary} />
        ))}
      </Svg>
      <View style={styles.labels}>
        <Text style={styles.labelText}>{min.toFixed(1)} kg</Text>
        <Text style={styles.labelText}>{max.toFixed(1)} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: PADDING,
  },
  labelText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
