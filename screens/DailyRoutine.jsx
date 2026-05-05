import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HabitCard from '../components/HabitCard';

const DailyRoutine = ({ habits, onHabitsChange }) => {
  const toggleHabitCompletion = (id) => {
    const updated = habits.map(h =>
      h.id === id
        ? { ...h, completed: !h.completed, streak: h.completed ? Math.max(0, h.streak - 1) : h.streak + 1 }
        : h
    );
    onHabitsChange(updated);
  };

  const completed = habits.filter(h => h.completed).length;

  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Daily routine</Text>
          <Text style={styles.sectionSub}>{completed}/{habits.length} completed</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: habits.length ? `${(completed / habits.length) * 100}%` : '0%' },
          ]}
        />
      </View>

      {/* Habit list */}
      <View style={styles.list}>
        {habits.map(item => (
          <HabitCard key={item.id} item={item} onToggle={toggleHabitCompletion} />
        ))}
      </View>
    </View>
  );
};

export default DailyRoutine;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
  },
  sectionSub: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#9E9E9E',
    marginTop: 2,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F0EDE8',
    borderRadius: 4,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7A33',
    borderRadius: 4,
  },
  list: {
    gap: 0,
  },
});
