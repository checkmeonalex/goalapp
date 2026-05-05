import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Animated,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TimePickerModal from '../components/TimePickerModal';
import VoiceTextInput from '../components/VoiceTextInput';

// ─── Notebook input ───────────────────────────────────────────────────────────
const LINE_HEIGHT = 40;
const COLLAPSED_LINES = 5;

const PLACEHOLDERS = [
  'e.g. 20-min morning run outside…',
  'e.g. Stretch & cool down for 10 min…',
  'e.g. Prepare a healthy breakfast…',
  'e.g. Read 10 pages of a book…',
  'e.g. Meditate for 5 quiet minutes…',
  'e.g. Journal your thoughts & wins…',
  'e.g. Cold shower to kickstart the day…',
  'e.g. 15 push-ups, 15 squats, repeat…',
];

function NotebookInput({ label, value, onChange }: { label: string; value: string; onChange: (t: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [phIndex, setPhIndex]   = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);
  const expandRef = useRef<TextInput>(null);

  useEffect(() => {
    if (value.length > 0) return;
    const timer = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 350, useNativeDriver: true }).start(() => {
        setPhIndex(i => (i + 1) % PLACEHOLDERS.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [value]);

  const collapsedHeight = LINE_HEIGHT * COLLAPSED_LINES;

  const Lines = ({ count }: { count: number }) => (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[nbStyles.line, { top: LINE_HEIGHT * (i + 1) - 1 }]}
          pointerEvents="none"
        />
      ))}
    </>
  );

  return (
    <>
      {/* ── Label + expand on the same line ── */}
      <View style={nbStyles.labelRow}>
        <Text style={nbStyles.labelText}>{label}</Text>
        <TouchableOpacity style={nbStyles.expandBtn} onPress={() => setExpanded(true)} activeOpacity={0.7}>
          <Ionicons name="expand-outline" size={13} color="#FF7A33" />
          <Text style={nbStyles.expandBtnText}>Expand note</Text>
        </TouchableOpacity>
      </View>

      {/* ── Collapsed notebook ── */}
      <View style={nbStyles.wrap}>
        <Lines count={COLLAPSED_LINES} />

        {!value && (
          <Animated.Text style={[nbStyles.placeholder, { opacity: fadeAnim }]} pointerEvents="none">
            {PLACEHOLDERS[phIndex]}
          </Animated.Text>
        )}

        <TextInput
          ref={inputRef}
          style={[nbStyles.input, { height: collapsedHeight }]}
          value={value}
          onChangeText={onChange}
          multiline
          textAlignVertical="top"
          placeholder=""
          selectionColor="#FF7A33"
        />
      </View>

      {/* ── Expanded full-screen note ── */}
      <Modal visible={expanded} animationType="slide" onRequestClose={() => setExpanded(false)}>
        <SafeAreaView style={nbStyles.modalSafe}>
          {/* Header */}
          <View style={nbStyles.modalHeader}>
            <View style={nbStyles.modalHeaderLeft}>
              <Ionicons name="book-outline" size={18} color="#FF7A33" />
              <Text style={nbStyles.modalTitle}>Routine notes</Text>
            </View>
            <TouchableOpacity style={nbStyles.doneBtn} onPress={() => setExpanded(false)}>
              <Text style={nbStyles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>

          {/* Notebook page */}
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView
              style={nbStyles.modalScroll}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={nbStyles.modalPage}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <View
                    key={i}
                    style={[nbStyles.line, { top: LINE_HEIGHT * (i + 1) - 1 }]}
                    pointerEvents="none"
                  />
                ))}

                {!value && (
                  <Animated.Text style={[nbStyles.placeholder, { opacity: fadeAnim }]} pointerEvents="none">
                    {PLACEHOLDERS[phIndex]}
                  </Animated.Text>
                )}

                <TextInput
                  ref={expandRef}
                  style={[nbStyles.input, { minHeight: LINE_HEIGHT * 30 }]}
                  value={value}
                  onChangeText={onChange}
                  multiline
                  textAlignVertical="top"
                  autoFocus
                  placeholder=""
                  selectionColor="#FF7A33"
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const nbStyles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF7A33',
  },

  wrap: {
    backgroundColor: '#FFFDF8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE7DF',
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E8E2D8',
    zIndex: 1,
  },
  placeholder: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 14,
    fontSize: 16,
    color: '#C5BDB4',
    lineHeight: LINE_HEIGHT,
    zIndex: 2,
  },
  input: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: LINE_HEIGHT,
    backgroundColor: 'transparent',
    zIndex: 3,
  },

  // Modal
  modalSafe: {
    flex: 1,
    backgroundColor: '#FFFDF8',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE7DF',
    backgroundColor: '#FFFDF8',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  doneBtn: {
    backgroundColor: '#FF7A33',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  modalScroll: {
    flex: 1,
  },
  modalPage: {
    flex: 1,
    position: 'relative',
    minHeight: LINE_HEIGHT * 32,
  },
});

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const INTERVALS = ['5 min', '10 min', '15 min', '30 min', '1 hr', '2 hr'];

type RoutineItem = {
  id: number;
  name: string;
  details: string;
  startTime: string | null;
  endTime: string | null;
  selectedDays: number[];
  remindersEnabled: boolean;
  reminderCount: number;
  reminderInterval: string;
  reminderEditorOpen: boolean;
};

type PickerState = {
  routineId: number;
  field: 'start' | 'end';
} | null;

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

function TimeBox({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string | null;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.timeBox} onPress={onPress} activeOpacity={0.75}>
      <Ionicons name={icon as any} size={16} color={value ? '#FF7A33' : '#BCBCBC'} />
      <Text style={[styles.timeBoxText, value && styles.timeBoxTextActive]}>{value ?? label}</Text>
    </TouchableOpacity>
  );
}

function formatDays(dayIndexes: number[]) {
  if (!dayIndexes.length) return 'No days selected';
  return dayIndexes.map((d) => DAYS[d]).join(' ');
}

function routineSummary(item: RoutineItem) {
  const start = item.startTime ?? '--';
  const end = item.endTime ?? '--';
  const reminder = item.remindersEnabled
    ? `${item.reminderCount}× every ${item.reminderInterval}`
    : 'No reminder';
  return `${start} – ${end} • ${formatDays(item.selectedDays)} • ${reminder}`;
}

export default function AddRoutineScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);

  const [routines, setRoutines] = useState<RoutineItem[]>([
    {
      id: 1,
      name: '',
      details: '',
      startTime: null,
      endTime: null,
      selectedDays: [1, 2, 3, 4, 5],
      remindersEnabled: true,
      reminderCount: 5,
      reminderInterval: '15 min',
      reminderEditorOpen: false,
    },
  ]);
  const [expandedId, setExpandedId] = useState<number>(1);
  const [activePicker, setActivePicker] = useState<PickerState>(null);

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  };

  const updateRoutine = (id: number, updater: (item: RoutineItem) => RoutineItem) => {
    setRoutines((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const toggleDay = (id: number, dayIndex: number) => {
    updateRoutine(id, (item) => ({
      ...item,
      selectedDays: item.selectedDays.includes(dayIndex)
        ? item.selectedDays.filter((d) => d !== dayIndex)
        : [...item.selectedDays, dayIndex],
    }));
  };

  const addRoutine = () => {
    setRoutines((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          name: '',
          details: '',
          startTime: null,
          endTime: null,
          selectedDays: [],
          remindersEnabled: true,
          reminderCount: 5,
          reminderInterval: '15 min',
          reminderEditorOpen: false,
        },
      ];
    });

    const nextId = routines.length ? Math.max(...routines.map((r) => r.id)) + 1 : 1;
    setExpandedId(nextId);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
  };

  const removeRoutine = (id: number) => {
    setRoutines((prev) => {
      if (prev.length === 1) return prev;
      const next = prev.filter((item) => item.id !== id);
      if (expandedId === id && next.length) setExpandedId(next[next.length - 1].id);
      return next;
    });
  };

  const handleTimeSave = (time: string) => {
    if (!activePicker) return;
    updateRoutine(activePicker.routineId, (item) =>
      activePicker.field === 'start' ? { ...item, startTime: time } : { ...item, endTime: time }
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>New routine</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../assets/images/homeasset/calendericon.png')}
            style={styles.calendarImage}
            resizeMode="contain"
          />
        </View>

        {routines.map((item, index) => {
          const expanded = expandedId === item.id;
          const displayTitle = item.name.trim() || `Routine ${index + 1}`;

          return (
            <View key={item.id} style={styles.section}>
              <TouchableOpacity
                style={styles.cardHeader}
                activeOpacity={0.8}
                onPress={() => setExpandedId(item.id)}
              >
                <View style={styles.cardTitleWrap}>
                  <Text style={styles.sectionTitle}>{displayTitle}</Text>
                  {!expanded && <Text style={styles.sectionSummary}>{routineSummary(item)}</Text>}
                </View>
                <View style={styles.cardHeaderRight}>
                  {routines.length > 1 && (
                    <TouchableOpacity onPress={() => removeRoutine(item.id)} style={styles.deleteBtn}>
                      <Ionicons name="trash-outline" size={16} color="#B55B5B" />
                    </TouchableOpacity>
                  )}
                  <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color="#666" />
                </View>
              </TouchableOpacity>

              {expanded && (
                <View style={styles.sectionBody}>
                  <Text style={styles.label}>Name your routine</Text>
                  <VoiceTextInput
                    style={styles.input}
                    placeholder="e.g. Morning workout"
                    placeholderTextColor="#C5BDB4"
                    value={item.name}
                    onChangeText={(text) => updateRoutine(item.id, (r) => ({ ...r, name: text }))}
                  />

                  <NotebookInput
                    label="What's your routine?"
                    value={item.details}
                    onChange={(text) => updateRoutine(item.id, (r) => ({ ...r, details: text }))}
                  />

                  <Text style={styles.label}>Schedule</Text>
                  <View style={styles.timeRow}>
                    <TimeBox
                      icon="time-outline"
                      label="Start time"
                      value={item.startTime}
                      onPress={() => setActivePicker({ routineId: item.id, field: 'start' })}
                    />
                    <TimeBox
                      icon="hourglass-outline"
                      label="End time"
                      value={item.endTime}
                      onPress={() => setActivePicker({ routineId: item.id, field: 'end' })}
                    />
                  </View>

                  <Text style={styles.label}>Repeat days</Text>
                  <View style={styles.daysRow}>
                    {DAYS.map((day, dayIndex) => (
                      <TouchableOpacity
                        key={`${item.id}-${dayIndex}`}
                        style={[
                          styles.dayCircle,
                          item.selectedDays.includes(dayIndex) && styles.dayCircleActive,
                        ]}
                        onPress={() => toggleDay(item.id, dayIndex)}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            item.selectedDays.includes(dayIndex) && styles.dayTextActive,
                          ]}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Reminders toggle */}
                  <View style={styles.reminderRow}>
                    <Text style={styles.label}>Get reminders</Text>
                    <Toggle
                      value={item.remindersEnabled}
                      onToggle={() =>
                        updateRoutine(item.id, (r) => ({
                          ...r,
                          remindersEnabled: !r.remindersEnabled,
                          reminderEditorOpen: !r.remindersEnabled ? true : r.reminderEditorOpen,
                        }))
                      }
                    />
                  </View>

                  {item.remindersEnabled && (
                    <View style={styles.reminderCard}>
                      <TouchableOpacity
                        style={styles.reminderHeader}
                        activeOpacity={0.8}
                        onPress={() =>
                          updateRoutine(item.id, (r) => ({
                            ...r,
                            reminderEditorOpen: !r.reminderEditorOpen,
                          }))
                        }
                      >
                        <Text style={styles.reminderHeaderText}>Customize reminder</Text>
                        <Ionicons
                          name={item.reminderEditorOpen ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color="#6E6E6E"
                        />
                      </TouchableOpacity>

                      {item.reminderEditorOpen && (
                        <View style={styles.reminderBody}>
                          <Text style={styles.reminderCardLabel}>How many times?</Text>
                          <View style={styles.stepperRow}>
                            <TouchableOpacity
                              style={[styles.stepperBtn, item.reminderCount <= 1 && styles.stepperBtnDisabled]}
                              onPress={() =>
                                updateRoutine(item.id, (r) => ({ ...r, reminderCount: Math.max(1, r.reminderCount - 1) }))
                              }
                              disabled={item.reminderCount <= 1}
                            >
                              <Text style={styles.stepperBtnText}>-</Text>
                            </TouchableOpacity>

                            <View style={styles.stepperValueWrap}>
                              <Text style={styles.stepperValue}>{item.reminderCount}</Text>
                              <Text style={styles.stepperUnit}>times</Text>
                            </View>

                            <TouchableOpacity
                              style={[styles.stepperBtn, item.reminderCount >= 20 && styles.stepperBtnDisabled]}
                              onPress={() =>
                                updateRoutine(item.id, (r) => ({ ...r, reminderCount: Math.min(20, r.reminderCount + 1) }))
                              }
                              disabled={item.reminderCount >= 20}
                            >
                              <Text style={styles.stepperBtnText}>+</Text>
                            </TouchableOpacity>
                          </View>

                          <View style={styles.reminderDivider} />

                          <Text style={styles.reminderCardLabel}>Interval between reminders</Text>
                          <View style={styles.intervalRow}>
                            {INTERVALS.map((iv) => (
                              <TouchableOpacity
                                key={iv}
                                style={[styles.intervalChip, item.reminderInterval === iv && styles.intervalChipActive]}
                                onPress={() => updateRoutine(item.id, (r) => ({ ...r, reminderInterval: iv }))}
                                activeOpacity={0.75}
                              >
                                <Text style={[styles.intervalChipText, item.reminderInterval === iv && styles.intervalChipTextActive]}>
                                  {iv}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <TouchableOpacity style={styles.addAnotherBtn} onPress={addRoutine} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={18} color="#FF7A33" />
          <Text style={styles.addAnotherText}>Add another routine</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleClose}>
          <Text style={styles.saveButtonText}>Save Routines</Text>
        </TouchableOpacity>
      </View>

      <TimePickerModal
        visible={activePicker !== null}
        onClose={() => setActivePicker(null)}
        onSave={handleTimeSave}
      />
    </View>
  );
}

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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  content: { flex: 1, paddingHorizontal: 24 },
  scrollContent: { paddingBottom: 32 },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  calendarImage: { width: 96, height: 96 },

  section: {
    width: '100%',
    paddingTop: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE8E0',
    paddingBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  cardTitleWrap: { flex: 1, paddingRight: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  sectionSummary: { fontSize: 12, color: '#8A8A8A', marginTop: 4 },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF2F2',
  },
  sectionBody: { borderTopWidth: 1, borderTopColor: '#F1ECE6', paddingTop: 12, paddingBottom: 4 },

  label: { fontSize: 14, fontWeight: '500', color: '#9E9E9E', marginBottom: 8, marginTop: 4 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0EAE3',
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#1A1A1A',
    marginBottom: 12,
  },

  timeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  timeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0EAE3',
    paddingHorizontal: 12,
    paddingVertical: 13,
    gap: 8,
  },
  timeBoxText: { flex: 1, fontSize: 14, color: '#BCBCBC' },
  timeBoxTextActive: { color: '#1A1A1A', fontWeight: '600' },

  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE7DE',
  },
  dayCircleActive: { backgroundColor: '#1F2937', borderColor: '#1F2937' },
  dayText: { fontSize: 13, fontWeight: '600', color: '#9E9E9E' },
  dayTextActive: { color: '#FFFFFF' },

  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addAnotherBtn: {
    marginTop: 4,
    marginBottom: 12,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFD4BC',
    backgroundColor: '#FFF4EC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addAnotherText: { color: '#FF7A33', fontSize: 14, fontWeight: '700' },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 12,
    backgroundColor: '#FAF4EC',
  },
  saveButton: {
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
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  toggleTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleTrackOn: { backgroundColor: '#FF7A33' },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: { alignSelf: 'flex-end' },

  // Reminder card
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EAE3',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    marginBottom: 8,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  reminderHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A6F64',
  },
  reminderBody: {
    paddingTop: 8,
  },
  reminderCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E9E9E',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  // Stepper
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF2EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD4BC',
  },
  stepperBtnDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E8E8E8',
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '300',
    color: '#FF7A33',
    lineHeight: 26,
  },
  stepperValueWrap: {
    alignItems: 'center',
  },
  stepperValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 40,
  },
  stepperUnit: {
    fontSize: 13,
    color: '#9E9E9E',
    marginTop: 2,
  },

  reminderDivider: {
    height: 1,
    backgroundColor: '#F0EAE3',
    marginVertical: 14,
  },

  // Interval chips
  intervalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intervalChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F2EE',
    borderWidth: 1,
    borderColor: '#EDE7E0',
  },
  intervalChipActive: {
    backgroundColor: '#FF7A33',
    borderColor: '#FF7A33',
  },
  intervalChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  intervalChipTextActive: {
    color: '#FFFFFF',
  },
});
