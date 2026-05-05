import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingButton({ onPress, active = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.buttonActive]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View style={{ transform: [{ rotate: active ? '45deg' : '0deg' }] }}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 28,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF7A33',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF7A33',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonActive: {
    backgroundColor: '#EC7E00',
  },
});
