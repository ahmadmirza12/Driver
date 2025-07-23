import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

export default function SplashScreen() {
  const navigation = useNavigation()
  const isOnBoarding = useSelector(state => state.authConfig.isOnBoarding);

  useEffect(() => {
    setTimeout(() => {
      if (isOnBoarding) {
        navigation.replace('Signup')
      } else {
        navigation.replace('OnBoarding')
      }
    }, 3000);
  }, [])

  return (
    <View style={styles.Container}>
      <StatusBar />
      <Text style={styles.TextContainer}>ASRA
        <Text style={{ color: '#FFBA0D' }}> Chauffeur </Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "#1F5546",
    justifyContent: "center",
    alignItems: "center"
  },
  TextContainer: {
    fontSize: 35, color: "white", fontWeight: "bold"
  }
})