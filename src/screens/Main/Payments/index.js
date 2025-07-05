import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CustomButton from "../../../components/CustomButton";

export default function PaymentMethod() {
  const [selectedCard, setSelectedCard] = useState('visa'); // 'visa' or 'fast'
  const navigation = useNavigation();

  const getSelectedCardNumber = () => {
    return selectedCard === 'visa' ? '3729' : '3739';
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#1F5546"
        barStyle="light-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      {/* VISA Card */}
      <Pressable style={styles.cardWrapper} onPress={() => setSelectedCard('visa')}>
        <View style={[styles.card, styles.cardVisa]}>
          <Image
            source={require("../../../assets/images/Visa.png")}
            style={styles.visaLogo}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>3729</Text>
          <View style={styles.radioOuter}>
            {selectedCard === 'visa' && <View style={styles.radioInner} />}
          </View>
        </View>
      </Pressable>

      {/* FAST Card */}
      <Pressable style={styles.cardWrapper} onPress={() => setSelectedCard('fast')}>
        <View style={[styles.card, styles.cardFast]}>
          <Image
            source={require("../../../assets/images/Fast.png")}
            style={styles.visaLogo}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>3739</Text>
          <View style={styles.radioOuter}>
            {selectedCard === 'fast' && <View style={styles.radioInner} />}
          </View>
        </View>
      </Pressable>

      {/* Inactive icon */}
      <TouchableOpacity style={styles.inactive} onPress={() => navigation.navigate('AddCard')}>
        <Image
          source={require("../../../assets/images/inactive.png")}
          style={{ width: 44, height: 44 }}
        />
      </TouchableOpacity>

      {/* Bottom button */}
      <View style={styles.bottomButtonContainer}>
        <CustomButton title={`Use Card - ${getSelectedCardNumber()}`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6F2',
  },
  header: {
    backgroundColor: '#1F5546',
    height: 114,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cardWrapper: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardVisa: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardFast: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  visaLogo: {
    width: 40,
    height: 28,
    borderRadius: 5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
    color: '#26433D',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1F5546',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1F5546',
  },
  inactive: {
    paddingTop: 20,
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
});
