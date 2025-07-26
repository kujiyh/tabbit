import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Medication } from '@/utils/database';
//import { useMedication } from '@contexts/MedicationContext';

const MEDICATION_COLORS = {
  red: '#FF3B30',
  orange: '#FF9500',
  green: '#34C759',
  blue: '#007AFF',
  purple: '#AF52DE',
  pink: '#FF2D92',
};

interface MedicationWithTaken extends Medication {
  taken: Record<string, boolean>;
}

export default function ScheduleScreen() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('daily');
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() == today.toDateString();
  }

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      week.push(weekDate);
    }
    return week;
  }

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month+1, 0);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - firstDay.getDay());
    
    const dates = [];
    const currentDate = new Date(startDay);

    while (dates.length < 42) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;

  }

  const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
  };

  const DailyView = () => {
    <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>

    </ScrollView>
  };

  const WeeklyView = () => {
    const weekDates = getWeekDates(selectedDate);
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.weekContainer}>
          {weekDates.map((date, index) => {

            const isTodayDate = isToday(date);
            const isSelectedDate = date.toDateString() === selectedDate.toDateString();

            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.weekDay, isSelectedDate && styles.selectedDay, isTodayDate && styles.todayWeekDay
                ]}
                onPress={() => {
                  setSelectedDate(date);
                  setCurrentView('daily');
                }}
              >
              <Text style={[styles.weekDayName, isSelectedDate && styles.selectedWeekDayText, isTodayDate && styles.todayWeekDayText]}>
                {dayNames[index]}
              </Text>
                <Text style={[styles.weekDayDate, !isTodayDate && isSelectedDate && styles.selectedDay, isTodayDate && styles.todayWeekDay]}>
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const MonthlyView = () => {
      const monthDates = getMonthDates(selectedDate);
      const monthName = selectedDate.toLocaleDateString('en-US', { month : 'long', year: 'numeric'});
      const weekHeaders = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
      return (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
          <View style={styles.monthContainer}>
            <View style={styles.monthGrid}>
              <View style={styles.monthHeaderRow}>
                {weekHeaders.map((day) => (
                  <Text key={day} style={styles.monthDayHeader}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.monthDatesContainer}>
                {monthDates.map((date, index) => {
                const isCurrentMonth = isSameMonth(date, selectedDate);
                const isTodayDate = isToday(date);
                const isSelectedDate = date.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity key={date.toISOString()} style={[styles.monthDateCell, !isCurrentMonth && styles.monthDateCellOtherMonth, 
                    isTodayDate && styles.monthDateCellToday, isSelectedDate && styles.monthDateCellSelected]}
                    onPress={() => {
                      setSelectedDate(date);
                      setCurrentView('daily');
                    }}>
                    <Text style={[styles.monthDateText, !isCurrentMonth && styles.monthDateTextOtherMonth,
                    isTodayDate && styles.monthDateTextToday, isSelectedDate && styles.monthDateTextSelected]}>
                      {date.getDate()}
                    </Text>    
                  
                  </TouchableOpacity>
                )
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      )
  };

  const ViewToggle = () => (
    <View style={styles.viewToggle}>
      {['daily', 'weekly', 'monthly'].map((view) => (
        <TouchableOpacity 
          key={view} 
          style={[
            styles.toggleButton,
            currentView === view && styles.toggleButtonActive,
          ]}
          onPress={() => setCurrentView(view)}>
            <Text style={[
             styles.toggleText,
              currentView === view && styles.toggleTextActive,
            ]}>
              {view.slice(0)}
            </Text>
          </TouchableOpacity>
      ))}
    </View>
  );

  const getHeaderTitle = () => {
    if (currentView === 'daily') {
      return formatDate(selectedDate);
    } 
    else if (currentView === 'weekly') {
      const weekDates = getWeekDates(selectedDate);
      const startDate = weekDates[0];
      const endDate = weekDates[6];
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric'})}`;
    }
    else {
    return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric'});
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => {
          const prevDate = new Date(selectedDate);
          prevDate.setDate(prevDate.getDate()-1);
          setSelectedDate(prevDate)
        }}>
          <ChevronLeft size={30} color='#18c75bc4' />
        </TouchableOpacity>

        <View style={styles.dateHeader}>
          <Text style={styles.dateText}>
            {getHeaderTitle()}
          </Text>
        </View>

        <TouchableOpacity style={styles.navButton} onPress={() => {
          const prevDate = new Date(selectedDate);
          prevDate.setDate(prevDate.getDate()+1);
          setSelectedDate(prevDate)
        }}>
          <ChevronRight size={30} color='#18c75bc4' />
        </TouchableOpacity>
      </View>
      <ViewToggle/>
      </View>
      {currentView === 'daily' && (
        <View style={styles.viewContainer}>
          <Text style={styles.viewLabel}>

          </Text>
        </View>
      )}
      {currentView === 'weekly' && 
          <WeeklyView />
      }
      {currentView === 'monthly' && (
        <MonthlyView/>
      )}
    </View>
  );


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF'
  },
  dateHeader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#1C1C1E',
    marginTop: 20
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconContainer: {
    marginLeft: 8,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    padding: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 2,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8E8E93'
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 10
  },
  toggleTextActive: {
    color: '#18c75bc4',
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF'
  },
  viewContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  viewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  content: {
    paddingHorizontal: 20,
  },

  // dailyView styles
  // weeklyView styles
  weekContainer: {
    paddingVertical: 20,
  },
  weekDay: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16, 
    marginBottom: 16,
    borderWidth: 2, 
    borderColor: '#CCCCCC'
  },
  todayWeekDay: {
    borderColor: '#34C759',
    backgroundColor: '#F0FFF4',
  },
  selectedDay: {
    color: '#FFFFFF',
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  weekDayDate: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  selectedWeekDayText: {
    color: '#FFFFFF'
  },
  todayWeekDayText: {
    color: '#34C759'
  },
  weekDayName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  // monthlyView styles
  monthContainer: {
    paddingVertical: 20,
  },
  monthGrid: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  monthDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    paddingVertical: 12,
  },
  monthDatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  monthDateCell: {
    width: `${100/7}%`,
    aspectRatio: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  monthDateCellToday: {
    backgroundColor: '#e3fdedff',
    borderWidth: 2,
    borderColor: '#34C759',
  },
  monthDateCellSelected: {
    backgroundColor: '#34C759',
  },
  monthDateCellOtherMonth: {
    opacity: 0.4,
  },
  monthDateText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  monthDateTextToday: {
    color: '#34C759',
    fontWeight: '700',
    
  },
  monthDateTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  monthDateTextOtherMonth: {
    color: '#8E8E93',
  },
  monthMedicationDots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthMedicationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});
