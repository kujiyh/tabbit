
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import {
    StyleSheet
} from 'react-native';

const MEDICATION_COLORS = [
  { name: 'blue', color: '#007AFF' },
  { name: 'green', color: '#34C759' },
  { name: 'orange', color: '#FF9500' },
  { name: 'purple', color: '#AF52DE' },
  { name: 'red', color: '#FF3B30' },
  { name: 'pink', color: '#FF2D92' },
  { name: 'yellow', color: '#FFFF00'}
];

const FREQUENCY_OPTIONS = [
  { label: 'Once daily', value: 'daily_1' },
  { label: 'Twice daily', value: 'daily_2' },
  { label: 'Three times daily', value: 'daily_3' },
  { label: 'Four times daily', value: 'daily_4' },
  { label: 'As needed', value: 'as_needed' },
  { label: 'Custom', value: 'custom' },
];

export default function ScheduleScreen() {
  return (
      <ThemedView style={styles.timesContainer}>
        <ThemedText type="title">words</ThemedText>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconContainer: {
    marginLeft: 8,
  },
});