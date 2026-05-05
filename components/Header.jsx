import { View, Text, Image, StyleSheet } from 'react-native';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function Header() {
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.greeting}>
          {getGreeting()},{'\n'}
          <Text style={styles.name}>Alex </Text>
          <Text style={styles.wave}>👋</Text>
        </Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
      <Image
        source={require('../assets/images/homeasset/avater (3).png')}
        style={styles.avatar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  textBlock: {
    flex: 1,
    paddingRight: 12,
  },
  greeting: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  name: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
  },
  wave: {
    fontSize: 22,
  },
  date: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#9E9E9E',
    marginTop: 4,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 18,
    marginTop: 2,
  },
});
