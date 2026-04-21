import { StyleSheet, Text, View, Image } from 'react-native'
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import React from 'react'


export default function index() {

const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_700Bold,
})

if (!fontsLoaded) return null

  return (
    <View style={{ flex: 1, }}>
      <View style={styles.welcomecontainer}>
        <Text style={styles.welcometext}>Morning, Alex!</Text>
        <Text style={styles.datetext}>Monday, October 2nd, 2026</Text>
      </View>

      <View style={styles.avater}>
        <Image
          source={require('../assets/images/homeasset/avater (3).png')}
          style={{ width: 80, height: 80, borderRadius: 25 }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  welcomecontainer: {
    marginTop: 48,
    display: 'flex',
    padding: 16,
  },

  welcometext: {
    fontSize: 34,
   fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
    color: '#333',
  },

  datetext: {
    fontSize: 16,
      fontFamily: 'Inter_700Regular',
    color: '#666',
  },

  avater: {
    position: 'absolute',
    top: 48,
    right: 16,
  },

})
