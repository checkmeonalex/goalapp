import { Stack, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddTodoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.title}>New todo</Text>
        <TouchableOpacity style={styles.close} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.placeholder}>Todo creation screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6', paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#111' },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: { marginTop: 32, color: '#6E6E6E', fontSize: 16 },
});
