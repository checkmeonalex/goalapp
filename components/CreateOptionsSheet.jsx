import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SHEET_HEIGHT = 320;

export default function CreateOptionsSheet({ visible, onClose, onSelect }) {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const options = useMemo(
    () => [
      {
        key: 'routine',
        title: 'Routine',
        description: 'Create a structured routine',
        icon: 'repeat-outline',
        route: '/add-routine',
      },
      {
        key: 'goal',
        title: 'Goal',
        description: 'Track a long-term goal',
        icon: 'flag-outline',
        route: '/add-goal',
      },
      {
        key: 'todo',
        title: 'Todo',
        description: 'Add a task',
        icon: 'checkbox-outline',
        route: '/add-todo',
      },
      {
        key: 'quick-reminder',
        title: 'Quick Reminder',
        description: 'Set a quick alert',
        icon: 'notifications-outline',
        route: '/add-reminder',
      },
    ],
    []
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : SHEET_HEIGHT,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: visible ? 220 : 160,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, visible]);

  return (
    <View pointerEvents={visible ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.sheet,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>Create</Text>
        {options.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={styles.row}
            activeOpacity={0.85}
            onPress={() => onSelect(option.route)}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={option.icon} size={20} color="#FF8C00" />
            </View>
            <View style={styles.copyWrap}>
              <Text style={styles.rowTitle}>{option.title}</Text>
              <Text style={styles.rowDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A9A9A9" />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E2E2',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#FFF1E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  copyWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D1D1D',
    marginBottom: 1,
  },
  rowDescription: {
    fontSize: 12,
    color: '#767676',
  },
});
