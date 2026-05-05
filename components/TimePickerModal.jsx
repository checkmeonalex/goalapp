import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';

const ITEM_HEIGHT = 64;
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

// ─── Single drum column ───────────────────────────────────────────────────────
function DrumColumn({ data, selectedIndex, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
    }, 80);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollEnd = useCallback((e) => {
    const index = Math.max(
      0,
      Math.min(Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT), data.length - 1)
    );
    onSelect(index);
  }, [data.length, onSelect]);

  return (
    <View style={styles.column}>
      {/* top fade mask */}
      <View style={styles.fadeMaskTop} pointerEvents="none" />

      <ScrollView
        ref={ref}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
      >
        {data.map((val, i) => {
          const dist = Math.abs(i - selectedIndex);
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.35 : 0.15;
          const fontSize = dist === 0 ? 36 : dist === 1 ? 26 : 20;
          const fontWeight = dist === 0 ? '700' : '400';
          const color = dist === 0 ? '#1A1A1A' : '#9E9E9E';

          return (
            <TouchableOpacity
              key={i}
              style={styles.drumItem}
              activeOpacity={0.6}
              onPress={() => {
                ref.current?.scrollTo({ y: i * ITEM_HEIGHT, animated: true });
                onSelect(i);
              }}
            >
              <Text style={{ fontSize, fontWeight, color, opacity }}>{val}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* selection highlight bar */}
      <View style={styles.selectionBar} pointerEvents="none" />

      {/* bottom fade mask */}
      <View style={styles.fadeMaskBottom} pointerEvents="none" />
    </View>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────
export default function TimePickerModal({ visible, onClose, onSave }) {
  const [hourIndex,   setHourIndex]   = useState(7);   // "08"
  const [minuteIndex, setMinuteIndex] = useState(0);   // "00"
  const [period,      setPeriod]      = useState('AM');

  const handleSave = () => {
    onSave(`${HOURS[hourIndex]}:${MINUTES[minuteIndex]} ${period}`);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Set reminder time</Text>
          <Text style={styles.subtitle}>Choose when you want to be reminded</Text>

          <View style={styles.pickerRow}>
            {/* Hours */}
            <DrumColumn data={HOURS}   selectedIndex={hourIndex}   onSelect={setHourIndex}   />

            <Text style={styles.colon}>:</Text>

            {/* Minutes */}
            <DrumColumn data={MINUTES} selectedIndex={minuteIndex} onSelect={setMinuteIndex} />

            {/* AM / PM */}
            <View style={styles.periodWrap}>
              {['AM', 'PM'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodBtn, period === p && styles.periodBtnOn]}
                  onPress={() => setPeriod(p)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.periodText, period === p && styles.periodTextOn]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Set Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const COLUMN_WIDTH = 80;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E0DA',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 28,
  },

  // Picker row
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 32,
  },
  colon: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    paddingBottom: 4,
    marginHorizontal: 2,
  },

  // Drum column
  column: {
    width: COLUMN_WIDTH,
    height: ITEM_HEIGHT * 3,
    overflow: 'hidden',
  },
  drumItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionBar: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 8,
    right: 8,
    height: ITEM_HEIGHT,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#FF7A33',
    borderRadius: 2,
  },
  fadeMaskTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.75)',
    zIndex: 1,
  },
  fadeMaskBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.75)',
    zIndex: 1,
  },

  // AM/PM
  periodWrap: {
    marginLeft: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#F0EDE8',
    gap: 2,
  },
  periodBtn: {
    width: 52,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  periodBtnOn: {
    backgroundColor: '#FF7A33',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  periodTextOn: {
    color: '#FFFFFF',
  },

  // Save button
  saveBtn: {
    backgroundColor: '#FF7A33',
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: 'center',
    shadowColor: '#FF7A33',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
