import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import CustomText from '../../../components/CustomText';

export default function GetStarted() {
  const navigation = useNavigation()
  const phoneInput = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.backIconWrapper}>
      
      </View>

      <View>
        <CustomText
          label="Let’s Get Started"
          fontSize={26}
          fontWeight="600"
          marginTop={20}
        />
        <CustomText
          label="Create your account"
          fontSize={16}
          fontWeight="400"
          marginTop={5}
        />
        <CustomText
          label="Enter your mobile number"
          fontSize={16}
          fontWeight="400"
          marginTop={30}
        />
      </View>

      <View style={styles.phoneInputWrapper}>
        <PhoneInput
          ref={phoneInput}
          defaultValue={phoneNumber}
          defaultCode="ID"
          layout="second"
          onChangeText={text => setPhoneNumber(text)}
          onChangeFormattedText={text => setFormattedValue(text)}
          withShadow
          autoFocus
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textInput}
          textInputStyle={{ fontSize: 16 }}
          codeTextStyle={{ fontSize: 16 }}
        />
      </View>
      <CustomText
        label='You will receive an SMS verification that may apply message and data rates.'
        fontSize={14}
        fontWeight='400'
        color='#727272'
        marginTop={10}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
        <Image source={require("../../../assets/images/ArrowRight.png")} style={{ width: 48, height: 48, marginTop: 20 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6F2',
    padding: 20,
  },
  backIconWrapper: {
    paddingTop: 20,
  },
  phoneInputWrapper: {
    marginTop: 20,
  },
  phoneContainer: {
    width: '100%',
    height: 60,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: '#fff',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
});
