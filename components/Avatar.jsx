import { View, Image, StyleSheet } from 'react-native';

export default function Avatar() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/homeasset/avater (3).png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 28,
    right: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
});