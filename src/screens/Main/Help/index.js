import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useNavigation } from 'expo-router';
import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';

export default function HelpSupport() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
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
        <Text style={styles.headerText}>Help & Support</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.form}>
            <CustomText label="Name" fontSize={15} fontWeight="400" />
            <CustomInput
              placeholder="Your name"
              marginTop={10}
              value={name}
              onChangeText={setName}
            />

            <CustomText label="Email" fontSize={15} fontWeight="400" />
            <CustomInput
              placeholder="Your email"
              marginTop={10}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <CustomText label="Message" fontSize={15} fontWeight="400" />
            <CustomInput
              placeholder="Message"
              marginTop={10}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              height={107}
/>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CustomButton title="Send" onPress={handleSubmit} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6F2',
  },
  flex: {
    flex: 1,
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
  scrollContainer: {
    paddingBottom: 20,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
