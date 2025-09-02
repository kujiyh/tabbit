
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useCallback }from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Touchable,
    Alert
} from 'react-native';
import { Save, Search, Plus, Clock } from 'lucide-react-native'

import { useMedications } from '@/contexts/MedicationContext';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


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
  { label: 'Weekly', value: 'weekly' },
  { label: 'As needed', value: 'as_needed' },
  { label: 'Custom', value: 'custom' },
];

const WEEK_DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

export default function AddMedicationScreen() {

  const [selectedMedication, setSelectedMedication] = useState('');
  const [dose, setDose] = useState('');
  const [freq, setFreq] = useState('daily_1');
  const [times, setTimes] = useState(['00:00']);
  const [instructions, setInstructions] = useState('');
  const [color, setColor] = useState('red');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [showColorSelector, setShowColorSelector] = useState(false);
  const [TimeIndex, setTimeIndex] = useState<number>();
  const [showStartDatePicker, setshowStartDatePicker] = useState(false);
  const [showStartEndPicker, setshowEndDatePicker] = useState(false);

  const {addMedication, error} = useMedications();

  const handleDaySelector = () => {
    setShowDaySelector(false);
  }

  const toggleDay = (dayValue: number) => {
    setSelectedDays(prev => {
      if (prev.includes(dayValue)) {
        return prev.filter(day => day !== dayValue);
      } else {
        return [...prev, dayValue].sort();
      }
    })
  }

  const getSelectedDays = () => {
    if (selectedDays.length == 0) {
      return 'Select days';
    }
    if (selectedDays.length == 7) {
      return 'Every day';
    }
    const dayNames = selectedDays.map(dayValue => WEEK_DAYS.find(day => day.value === dayValue)?.label).filter(Boolean);
    return dayNames.join(', ');
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const medicationData = {
        name: selectedMedication,
        dose,
        freq,
        times: freq == 'as_needed' ? [] : times,
        selectedDays: freq == 'weekly' ? selectedDays : [],
        instructions,
        color: color,
        startDate,
        endDate,
        isActive: true,
      };
      await addMedication(medicationData);
      Alert.alert('Success!', 
        'Medication added successfully.', [{
          text: 'OK',
          onPress: () => {
            resetForm();
          }
        }])
    }
    catch (error) {
      throw new Error('couldnt save :C');
    }
    finally {
      setSaving(false);
    }
  }

  const freqChange = (value: string) => {
    setFreq(value);
    const timesMap: Record<string, string[]> = {
      daily_1: ['08:00'],
      daily_2: ['08:00', '18:00'],
      daily_3: ['08:00', '12:00', '18:00'],
      daily_4: ['08:00', '12:00', '16:00', '20:00'],
      weekly: ['08:00'],
      as_needed: [],
      custom: ['08:00'],
    };
    setTimes(timesMap[value])

    if (value !== 'weekly') {
      setSelectedDays([]);
    }

  }

  const resetForm = () => {
    setSelectedMedication('');
    setDose('');
    setFreq('daily_1');
    setTimes(['08:00']);
    setSelectedDays([]);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setInstructions('');
    setColor('red');
    setSearchQuery('');
    setShowDaySelector(false);
    setShowTimeSelector(false);
    setShowColorSelector(false);
  }

  const addTime = () => {
    setTimes([...times, '08:00']);
  };

  const openTimeSelector = (index: number) => {
    setTimeIndex(index);
    setShowTimeSelector(true);
  }

  const closeTimeSelector = (index: number) => {
    setShowTimeSelector(false);
  }

  const TimeList = ({time, index}: {time: string; index: number}) => {
    const handlePress = () => {
      openTimeSelector(index);
    }
    return (
      <TouchableOpacity style={styles.timeList} onPress={handlePress}>
        <Clock size={16} color='#777777'/>
        <Text style={styles.timeText}>{time}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Medication</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Save size={20} color='#FFFFFF'/>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication Name</Text>
          <TouchableOpacity style={styles.searchContainer}>
            <Search size={16} color='#777777'/>
              <TextInput
                style={styles.input} 
                value = {selectedMedication}
                onChangeText={setSelectedMedication}
                placeholder = 'Enter medication...'
                placeholderTextColor='#777777'/>
          </TouchableOpacity>
          
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dosage</Text>
          <TouchableOpacity style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            value={dose}
            onChangeText={setDose}
            placeholder="e.g., 10mg, 2 tablets"
            placeholderTextColor="#777777"/>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <View style={styles.freqOptions}>
            {FREQUENCY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.freqOption,
                  freq === option.value && styles.selectedFreq,
                ]}
                onPress={() => freqChange(option.value)}
              > 
                <Text
                  style={[
                    styles.freqText,
                    freq === option.value && styles.selectedFreqText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {freq == 'weekly' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Days of Week</Text>
            <TouchableOpacity style={styles.daySelector}
              onPress={() => setShowDaySelector(true)}>
                <Text style={styles.daySelectorText}>{getSelectedDays()}</Text>
            </TouchableOpacity>
        </View>
        )}
        {(freq !== 'as_needed' && freq !== 'weekly') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Times</Text>
            <TouchableOpacity style={styles.addTimeButton} 
              onPress={addTime}>
              <Plus size={16} color='#3cc743c7' />
                <Text style={styles.addTimeText}>Add Time</Text>
                  </TouchableOpacity>
            <View style={styles.timesContainer}>
                {times.map((time, index) => (
                  <TimeList key={index} time={time} index={index}/>
                ))}
            </View>
        </View>
        )}
        {(freq === 'weekly' && selectedDays.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Times for Selected Days</Text>
            <TouchableOpacity style={styles.addTimeButton} 
              onPress={addTime}>
              <Plus size={16} color='#3cc743c7' />
                <Text style={styles.addTimeText}>Add Time</Text>
                  </TouchableOpacity>
            <View style={styles.timesContainer}>
                {times.map((time, index) => (
                  <TimeList key={index} time={time} index={index}/>
                ))}
            </View>
          </View>
        )}

      </ScrollView>
        {showDaySelector && (
          <View style={styles.modalPop}>
            <View style={styles.daySelectorModal}>
              <View style={styles.daySelectorHeader}>
                <Text style={styles.daySelectorTitle}>Select Days</Text>
                <TouchableOpacity onPress={handleDaySelector}>
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dayList}>
                {WEEK_DAYS.map((day) => (
                  <TouchableOpacity 
                    key={day.value}
                    style={[styles.dayButton, selectedDays.includes(day.value) && styles.selectedDayButton]}
                    onPress={() => toggleDay(day.value)}>
                    <Text style={[styles.dayButtonText, selectedDays.includes(day.value) && styles.selectedDayButtonText]}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                )
                )}
              </View>
            </View>
          </View>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3cc743c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8
  },
  saveText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 8
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#676767',
  },
  selectedFreq: {
    backgroundColor: '#3cc743c7',
  },
  selectedFreqText: {
    color: '#FFFFFF',
  },
  freqText: {
    color: '#676767',
    fontSize: 16,
  },
  freqOption: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
  },
  freqOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  daySelectorText: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '500',
  },
  daySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalPop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 67,
  },
  daySelectorModal: {
    borderRadius: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    backgroundColor: '#FFFFFF'
  },
  daySelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  daySelectorTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  doneText: {
    fontSize: 16,
    color: '#3cc743c7',
    fontWeight: '600',
  },
  dayList: {
    padding: 20,
    gap: 8,
  },
  dayButton: {  
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  selectedDayButton: {
    backgroundColor: '#3cc743c7',
  },
  dayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000010',
    width: 40,
  },
  selectedDayButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    width: 40,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  addTimeText: {
    fontSize: 16,
    color: '#3cc743c7',
    fontWeight: '500',
    alignItems: 'flex-end',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
});
