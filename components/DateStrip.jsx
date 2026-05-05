import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { getWeekDates } from '../utils/date';

export default function DateStrip() {
  const { width } = useWindowDimensions();
  const weekDates = getWeekDates();
  const todayDate = new Date().getDate();
  const [activeDate, setActiveDate] = useState(todayDate);

  const circleSize = Math.floor((width - 40 - 48) / 7);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {weekDates.map((item, index) => {
          const isActive = item.date === activeDate;
          const isToday = item.date === todayDate;

          return (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => setActiveDate(item.date)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
                {item.day.slice(0, 2)}
              </Text>
              <View
                style={[
                  styles.circle,
                  { width: circleSize, height: circleSize, borderRadius: circleSize / 2 },
                  isActive && styles.circleActive,
                  isToday && !isActive && styles.circleToday,
                ]}
              >
                <Text style={[styles.dateText, isActive && styles.dateTextActive, isToday && !isActive && styles.dateTextToday]}>
                  {item.date}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#BCBCBC',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayLabelActive: {
    color: '#FF7A33',
    fontFamily: 'Inter_700Bold',
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  circleActive: {
    backgroundColor: '#1A1A1A',
  },
  circleToday: {
    backgroundColor: '#FFF0E8',
  },
  dateText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#666',
  },
  dateTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  dateTextToday: {
    fontFamily: 'Inter_700Bold',
    color: '#FF7A33',
  },
});
