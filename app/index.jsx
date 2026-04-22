import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter'
import React from 'react'

export default function index() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  })

  if (!fontsLoaded) return null

  // current week (Mon → Sun)
  const getWeekDates = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 (Sun) - 6 (Sat)

    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)

    const week = []

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)

      week.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        fullDate: d,
      })
    }

    return week
  }

  const weekDates = getWeekDates()
  const todayDate = new Date().getDate()

  return (
    <View style={{ flex: 1 }}>

      {/* Welcome */}
      <View style={styles.welcomecontainer}>
        <Text style={styles.welcometext}>Morning, Alex!</Text>
        <Text style={styles.datetext}>

          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      </View>

      {/* Avatar */}
      <View style={styles.avater}>
        <Image
          source={require('../assets/images/homeasset/avater (3).png')}
          style={{ width: 80, height: 80, borderRadius: 25 }}
        />
      </View>

      {/* 📅 Date Row */}
      <View style={styles.dateRow}>
        {weekDates.map((item, index) => {
          const isActive = item.date === todayDate

          return (
            <View key={index} style={styles.dateItem}>
              <Text style={styles.dayText}>{item.day}</Text>

              <View style={[styles.circle, isActive && styles.activeCircle]}>
                <Text style={[styles.dateText, isActive && styles.activeText]}>
                  {item.date}
                </Text>
              </View>
            </View>
          )
        })}
      </View>

      
{/* Float Button */}
 <View style={styles.floatbtn}>
  <Text style={styles.fabIcon}>+</Text>
 </View>

 <View style={styles.actioncard}>
  <Text style={styles.actiontitle}>Set the reminder</Text>
  <Text style={styles.actiondesc}>Never miss your morning routine</Text>
  <Text style={styles.actiondescchild}>Set a reminder to stay on track</Text>

   <TouchableOpacity style={styles.actionbtn}>
  <Text style={styles.actionbtntext} style={{ color: '#fff', fontFamily: 'Inter_300Regular', textAlign: 'center', fontSize: 16 }}>Set Now</Text>
 </TouchableOpacity>
  <Image source={require('../assets/images/homeasset/bellhome.png')} style={{ position: 'absolute', top: 16, right: 20, width: 140, height: 140 }} />


 </View>




    </View>
  )
}

const styles = StyleSheet.create({
  welcomecontainer: {
    marginTop: 48,
    padding: 16,
  },

  welcometext: {
    fontSize: 34,
    fontFamily: 'Inter_700Bold',
    color: '#333',
  },

  datetext: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginTop: 4,
  },

  avater: {
    position: 'absolute',
    top: 48,
    right: 16,
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },

  dateItem: {
    alignItems: 'center',
  },

  dayText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    fontFamily: 'Inter_400Regular',
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeCircle: {
    backgroundColor: '#111',
  },

  dateText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Inter_400Regular',
  },

  activeText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
  },

  floatbtn: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56, 
    borderRadius: 28,
    backgroundColor: '#ff8800',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
  },

  fabIcon: {
    fontSize: 34,
    color: '#fff',
    lineHeight: 56,},

actioncard: {
  padding: 16,
  margin: 11,
  backgroundColor: '#ff8c099f',
  borderRadius: 20,
},

actiontitle: {
  fontSize: 25,
  fontFamily: 'Inter_700Bold',
  color: '#111',
},

actiondesc: {
  fontSize: 17,
  fontFamily: 'Inter_400Regular',
  color: '#666',
  marginTop: 4,
},

actiondescchild: {
  fontSize: 17,
  fontFamily: 'Inter_400Regular',
  color: '#666',
  marginTop: 1,
},

  actionbtn: {
    position: 'relative',
   padding: 13,
     marginTop: 16,
   width: '23%',
    borderRadius: 28,
    backgroundColor: '#301900',
  },
})