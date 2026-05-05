import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HabitCard({ item, onToggle }) {
  return (
    <TouchableOpacity
      style={[styles.card, item.completed && styles.cardDone]}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.75}
    >
      <View style={[styles.iconWrap, item.completed && styles.iconWrapDone]}>
        <Ionicons
          name={item.completed ? 'checkmark' : 'checkmark'}
          size={16}
          color={item.completed ? '#FFFFFF' : '#D0C9C0'}
        />
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, item.completed && styles.titleDone]} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>🔥 {item.streak} day streak</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{item.duration}</Text>
        </View>
      </View>

      <View style={[styles.durationBadge, item.completed && styles.durationBadgeDone]}>
        <Ionicons
          name="time-outline"
          size={12}
          color={item.completed ? '#FF7A33' : '#BCBCBC'}
        />
        <Text style={[styles.badgeText, item.completed && styles.badgeTextDone]}>
          {item.duration}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  cardDone: {
    backgroundColor: '#FFF8F4',
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#E5E0DA',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  iconWrapDone: {
    backgroundColor: '#FF7A33',
    borderColor: '#FF7A33',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  titleDone: {
    color: '#BCBCBC',
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#9E9E9E',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D0C9C0',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationBadgeDone: {
    backgroundColor: '#FFF0E8',
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: '#BCBCBC',
  },
  badgeTextDone: {
    color: '#FF7A33',
  },
});
