import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CustomButton from '../../../components/CustomButton';
import CustomCountryPick from '../../../components/CustomCountryPick';
import CustomInput from '../../../components/CustomInput';
import CustomText from '../../../components/CustomText';
import UploadImage from '../../../components/UploadImage';

const EditProfile = ({ navigation }) => {
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  // Placeholder for form errors — replace with validation as needed
  const errors = {
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    phoneNumber: '',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      {/* Scrollable Form Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <UploadImage />

        <CustomText label="First Name" fontSize={15} marginTop={10} fontWeight="500" />
        <CustomInput
          placeholder="Name"
          marginTop={10}
          value={state.firstName}
          onChangeText={(text) => setState((prev) => ({ ...prev, firstName: text }))}
          error={errors.firstName}
        />

        <CustomText label="Surname" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Surname"
          marginTop={10}
          value={state.lastName}
          onChangeText={(text) => setState((prev) => ({ ...prev, lastName: text }))}
          error={errors.lastName}
        />

        <CustomText label="Age" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Age"
          marginTop={10}
          keyboardType="numeric"
          value={state.age}
          onChangeText={(text) => setState((prev) => ({ ...prev, age: text }))}
          error={errors.age}
        />

        <CustomText label="Password" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Password"
          marginTop={10}
          secureTextEntry
          value={state.password}
          onChangeText={(text) => setState((prev) => ({ ...prev, password: text }))}
          error={errors.password}
        />

        <CustomText label="Email Address" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Your Email Address"
          marginTop={10}
          keyboardType="email-address"
          value={state.email}
          onChangeText={(text) => setState((prev) => ({ ...prev, email: text }))}
          error={errors.email}
        />

        <CustomText label="Phone Number" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Number"
          marginTop={10}
          keyboardType="phone-pad"
          value={state.phoneNumber}
          onChangeText={(text) => setState((prev) => ({ ...prev, phoneNumber: text }))}
          error={errors.phoneNumber}
        />

        <CustomCountryPick />
        <CustomButton
        title='Update'
        fontSize={16}
        fontWeight='400'
        marginTop={30}
        backgroundColor='#1F5546'
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F6F2',
  },
  header: {
    backgroundColor: '#1F5546',
    height: 114,
    width: '100%',
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
});
