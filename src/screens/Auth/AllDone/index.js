import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function AllDone() {
  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login')
    }, 3000);
  })

  return (
    <View style={styles.container}>
      <View style={styles.centeredView}>
        <Image
          source={require("../../../assets/images/Mask.png")}
          style={styles.image}
        />
        <Text style={styles.Text}>Your profile is under review</Text>
      </View>
      <Image source={require("../../../assets/images/CarImg.png")} style={{ width: 375, height: 231 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E8F6F2'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  image: {
    width: 80,
    height: 80
  },
  Text: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 40,
    width: 329,
    textAlign: 'center',
    paddingTop: 40
  }

});
