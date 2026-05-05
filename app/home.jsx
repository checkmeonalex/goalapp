import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import Header from '../components/Header';
import DateStrip from '../components/DateStrip';
import ActionCard from '../components/ActionCard';
import FloatingButton from '../components/FloatingButton';
import CreateOptionsSheet from '../components/CreateOptionsSheet';
import DailyRoutine from '../screens/DailyRoutine';

export default function Home() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [habits, setHabits] = useState([
    { id: '1', title: 'Drink a glass of water', streak: 3, duration: '5 min', completed: false },
    { id: '2', title: 'Meditate to relax', streak: 6, duration: '15 min', completed: false },
    { id: '3', title: 'Stretch for 10 minutes', streak: 5, duration: '10 min', completed: false },
    { id: '4', title: 'Go for a short walk', streak: 3, duration: '15 min', completed: false },
  ]);

  if (!fontsLoaded) return null;

  const toggleSheet = () => {
    setIsSheetOpen((prev) => !prev);
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  const handleSelect = (route) => {
    closeSheet();
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <DateStrip />
        <ActionCard />
        <DailyRoutine habits={habits} onHabitsChange={setHabits} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <CreateOptionsSheet visible={isSheetOpen} onClose={closeSheet} onSelect={handleSelect} />
      <FloatingButton onPress={toggleSheet} active={isSheetOpen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});
