import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TimePickerModal from '../components/TimePickerModal';
import VoiceTextInput from '../components/VoiceTextInput';

// ─── Toggle ────────────────────────────────────────────────────────────────
function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      style={[styles.toggleTrack, value && styles.toggleTrackOn]}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
    </TouchableOpacity>
  );
}

// ─── Calendar modal ─────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function CalendarModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: Date | null;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const grid: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) grid.push(d);
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
  }, [viewYear, viewMonth]);

  const isSelected = (day: number) =>
    selected !== null &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.calendarCard}>
          {/* Month nav */}
          <View style={styles.calNavRow}>
            <TouchableOpacity onPress={prevMonth} style={styles.calNavBtn}>
              <Ionicons name="chevron-back" size={18} color="#444" />
            </TouchableOpacity>
            <Text style={styles.calMonthTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.calNavBtn}>
              <Ionicons name="chevron-forward" size={18} color="#444" />
            </TouchableOpacity>
          </View>

          {/* Day-of-week headers */}
          <View style={styles.calGrid}>
            {DAY_HEADERS.map(h => (
              <Text key={h} style={styles.calDayHeader}>{h}</Text>
            ))}
            {cells.map((day, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.calDayCell,
                  day !== null && isSelected(day) && styles.calDayCellSelected,
                  day !== null && isToday(day) && !isSelected(day) && styles.calDayCellToday,
                ]}
                disabled={day === null}
                onPress={() => {
                  if (day !== null) {
                    onSelect(new Date(viewYear, viewMonth, day));
                    onClose();
                  }
                }}
              >
                {day !== null && (
                  <Text
                    style={[
                      styles.calDayText,
                      isSelected(day) && styles.calDayTextSelected,
                      isToday(day) && !isSelected(day) && styles.calDayTextToday,
                    ]}
                  >
                    {day}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.calClearBtn} onPress={() => { onSelect(null as any); onClose(); }}>
            <Text style={styles.calClearText}>Clear date</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Amount modal ────────────────────────────────────────────────────────────
const UNITS = ['times', 'mins', 'hours', 'pages', 'ml', 'km'];

function AmountModal({
  visible,
  amount,
  unit,
  onSave,
  onClose,
}: {
  visible: boolean;
  amount: string;
  unit: string;
  onSave: (amount: string, unit: string) => void;
  onClose: () => void;
}) {
  const [localAmount, setLocalAmount] = useState(amount);
  const [localUnit, setLocalUnit] = useState(unit || 'times');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View style={styles.amountCard}>
          <Text style={styles.amountTitle}>Set amount</Text>

          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#C5BDB4"
            value={localAmount}
            onChangeText={setLocalAmount}
            autoFocus
            maxLength={6}
          />

          <Text style={styles.amountUnitLabel}>Unit</Text>
          <View style={styles.unitRow}>
            {UNITS.map(u => (
              <TouchableOpacity
                key={u}
                style={[styles.unitChip, localUnit === u && styles.unitChipSelected]}
                onPress={() => setLocalUnit(u)}
              >
                <Text style={[styles.unitChipText, localUnit === u && styles.unitChipTextSelected]}>
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.amountSaveBtn}
            onPress={() => { onSave(localAmount, localUnit); onClose(); }}
          >
            <Text style={styles.amountSaveBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function AddGoalScreen() {
  const router = useRouter();

  const [habitName, setHabitName] = useState('');
  const [setGoalChecked, setSetGoalChecked] = useState(false);
  const [repeatChecked, setRepeatChecked] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([3]);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [showAmountPicker, setShowAmountPicker] = useState(false);
  const [amount, setAmount] = useState('');
  const [amountUnit, setAmountUnit] = useState('times');

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState<string | null>(null);

  const toggleDay = (index: number) => {
    setSelectedDays(prev =>
      prev.includes(index) ? prev.filter(d => d !== index) : [...prev, index]
    );
  };

  const dateLabel = selectedDate
    ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Add date';

  const amountLabel = amount ? `${amount} ${amountUnit}` : 'Add amount';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New habit</Text>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/home');
            }
          }}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={20} color="#444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Illustration */}
        <View style={styles.illustrationWrapper}>
          <View style={styles.decorLeft}>
            <Text style={styles.decorTextLeft}>{'~\n✦'}</Text>
          </View>
          <Image
            source={require('../assets/images/homeasset/calendericon.png')}
            style={styles.calendarImage}
            resizeMode="contain"
          />
          <View style={styles.decorRight}>
            <Text style={styles.decorTextRight}>{'✿\n❋'}</Text>
          </View>
        </View>

        {/* Name */}
        <Text style={styles.label}>Name your habit</Text>
        <VoiceTextInput
          style={styles.input}
          placeholder="Morning Meditations"
          placeholderTextColor="#C5BDB4"
          value={habitName}
          onChangeText={setHabitName}
          returnKeyType="done"
        />

        {/* Set a goal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Set a goal</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setSetGoalChecked(v => !v)}
          >
            {setGoalChecked && <Ionicons name="checkmark" size={13} color="#FF7A33" />}
          </TouchableOpacity>
        </View>
        <View style={styles.goalRow}>
          <TouchableOpacity style={styles.goalBox} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={16} color={selectedDate ? '#FF7A33' : '#BCBCBC'} />
            <Text style={[styles.boxText, selectedDate ? styles.boxTextActive : null]}>
              {dateLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.goalBox, { flex: 1.1 }]} onPress={() => setShowAmountPicker(true)}>
            <Text style={[styles.boxText, amount ? styles.boxTextActive : null]}>
              {amountLabel}
            </Text>
            <Ionicons name="chevron-down" size={15} color={amount ? '#FF7A33' : '#BCBCBC'} />
          </TouchableOpacity>
        </View>

        {/* Repeat days */}
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>Repeat days</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setRepeatChecked(v => !v)}
          >
            {repeatChecked && <Ionicons name="checkmark" size={13} color="#FF7A33" />}
          </TouchableOpacity>
        </View>
        <View style={styles.daysRow}>
          {DAYS.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dayCircle, selectedDays.includes(index) && styles.dayCircleActive]}
              onPress={() => toggleDay(index)}
            >
              <Text style={[styles.dayText, selectedDays.includes(index) && styles.dayTextActive]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Get reminders */}
        <View style={styles.reminderRow}>
          <Text style={styles.label}>Get reminders</Text>
          <Toggle
            value={remindersEnabled}
            onToggle={() => {
              setRemindersEnabled(v => !v);
              if (remindersEnabled) setReminderTime(null);
            }}
          />
        </View>

        {remindersEnabled && (
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.75}
          >
            <Ionicons
              name="time-outline"
              size={18}
              color={reminderTime ? '#FF7A33' : '#BCBCBC'}
            />
            <Text style={[styles.timeRowText, reminderTime && styles.timeRowTextActive]}>
              {reminderTime ?? 'Tap to set reminder time'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#BCBCBC" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Save */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/home');
            }
          }}
        >
          <Text style={styles.saveButtonText}>Save Habit</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <CalendarModal
        visible={showDatePicker}
        selected={selectedDate}
        onSelect={setSelectedDate}
        onClose={() => setShowDatePicker(false)}
      />
      <AmountModal
        visible={showAmountPicker}
        amount={amount}
        unit={amountUnit}
        onSave={(a, u) => { setAmount(a); setAmountUnit(u); }}
        onClose={() => setShowAmountPicker(false)}
      />
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onSave={(time) => setReminderTime(time)}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4EC' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 62 : 44,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 26, fontWeight: '700', color: '#1A1A1A', letterSpacing: -0.3 },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },

  content: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 32 },

  illustrationWrapper: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 8, marginBottom: 24,
  },
  decorLeft: { marginRight: 8, alignItems: 'flex-end' },
  decorTextLeft: { fontSize: 18, color: '#FF8C42', lineHeight: 22, textAlign: 'right' },
  calendarImage: { width: 110, height: 110 },
  decorRight: { marginLeft: 8, alignItems: 'flex-start' },
  decorTextRight: { fontSize: 18, color: '#D97FBE', lineHeight: 22 },

  label: { fontSize: 14, fontWeight: '500', color: '#9E9E9E', marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 15,
    fontSize: 16, color: '#1A1A1A', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 8, marginTop: 4,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 1.5, borderColor: '#D0C9C0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
  },

  goalRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  goalBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 13, gap: 6,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  boxText: { flex: 1, fontSize: 14, color: '#BCBCBC' },
  boxTextActive: { color: '#1A1A1A' },

  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dayCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 }, elevation: 1,
  },
  dayCircleActive: { backgroundColor: '#1F2937', shadowOpacity: 0, elevation: 0 },
  dayText: { fontSize: 13, fontWeight: '600', color: '#9E9E9E' },
  dayTextActive: { color: '#FFFFFF' },

  reminderRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: 4, marginBottom: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
    marginBottom: 8,
  },
  timeRowText: {
    flex: 1,
    fontSize: 15,
    color: '#BCBCBC',
  },
  timeRowTextActive: {
    color: '#1A1A1A',
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 12,
    backgroundColor: '#FAF4EC',
  },
  saveButton: {
    backgroundColor: '#FF7A33', borderRadius: 18,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#FF7A33', shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  // Toggle
  toggleTrack: {
    width: 50, height: 28, borderRadius: 14,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center', paddingHorizontal: 3,
  },
  toggleTrackOn: { backgroundColor: '#FF7A33' },
  toggleThumb: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: { alignSelf: 'flex-end' },

  // Modal shared
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Calendar modal
  calendarCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20,
    padding: 20, width: 320,
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  calNavRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  calNavBtn: { padding: 4 },
  calMonthTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calDayHeader: {
    width: `${100 / 7}%`, textAlign: 'center',
    fontSize: 12, fontWeight: '600', color: '#9E9E9E', marginBottom: 6,
  },
  calDayCell: {
    width: `${100 / 7}%`, aspectRatio: 1,
    justifyContent: 'center', alignItems: 'center',
    borderRadius: 100, marginBottom: 2,
  },
  calDayCellSelected: { backgroundColor: '#FF7A33' },
  calDayCellToday: { backgroundColor: '#FFF0E8' },
  calDayText: { fontSize: 14, color: '#1A1A1A' },
  calDayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  calDayTextToday: { color: '#FF7A33', fontWeight: '600' },
  calClearBtn: { marginTop: 12, alignItems: 'center' },
  calClearText: { fontSize: 13, color: '#9E9E9E' },

  // Amount modal
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 28, paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    width: '100%',
  },
  amountTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 20 },
  amountInput: {
    backgroundColor: '#FAF4EC', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 28, fontWeight: '600', color: '#1A1A1A',
    textAlign: 'center', marginBottom: 20,
  },
  amountUnitLabel: { fontSize: 13, fontWeight: '500', color: '#9E9E9E', marginBottom: 10 },
  unitRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  unitChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#F5F5F5',
  },
  unitChipSelected: { backgroundColor: '#FF7A33' },
  unitChipText: { fontSize: 14, color: '#666' },
  unitChipTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  amountSaveBtn: {
    backgroundColor: '#FF7A33', borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  amountSaveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
