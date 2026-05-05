import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import TimePickerModal from './TimePickerModal';

export default function ActionCard() {
  const [showPicker, setShowPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);

  return (
    <>
      <View style={styles.card}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>Set a reminder</Text>
          <Text style={styles.desc}>
            Never miss your morning{'\n'}routine. Stay on track.
          </Text>

          {reminderTime && (
            <View style={styles.timeBadge}>
              <Text style={styles.timeBadgeText}>⏰ {reminderTime}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.buttonText}>
              {reminderTime ? 'Change time' : 'Set Now'}
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={require('../assets/images/homeasset/bellhome.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <TimePickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSave={(time) => setReminderTime(time)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE9D5',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  textBlock: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  desc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#7A6050',
    lineHeight: 19,
    marginBottom: 12,
  },
  timeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  timeBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#FF7A33',
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  image: {
    width: 90,
    height: 90,
  },
});
