import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {
  StyleSheet
} from 'react-native';

export default function ScheduleScreen() {
  return (
      <ThemedView style={styles.timesContainer}>
        <ThemedText type="title">setings :P</ThemedText>
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