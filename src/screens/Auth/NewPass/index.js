import { AntDesign } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import ScreenWrapper from '../../../components/ScreenWrapper';

import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import { COLORS } from '../../../utils/COLORS';
import { passwordRegex } from '../../../utils/constants';

const NewPass = ({ navigation, route }) => {
  const token = route?.params?.token;
  const code = route?.params?.code;

  const [isModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const init = {
    password: '',
    confirmPassword: '',
  };

  const inits = {
    passwordError: '',
    confirmPasswordError: '',
  };

  const [state, setState] = useState(init);
  const [errors, setErrors] = useState(inits);

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (!state.password) newErrors.passwordError = 'Please enter password';
      else if (!passwordRegex.test(state.password))
        newErrors.passwordError =
          'Password must contain 8 characters and an underscore';

      if (!state.confirmPassword)
        newErrors.confirmPasswordError = 'Please enter confirm password';
      else if (!passwordRegex.test(state.confirmPassword))
        newErrors.confirmPasswordError =
          'Password must contain 8 characters and an underscore';
      else if (state.password !== state.confirmPassword)
        newErrors.confirmPasswordError = 'Passwords do not match';

      setErrors(newErrors);
    };
  }, [state]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

  const handleSetNewPassword = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModal(true);
      setTimeout(() => {
        setModal(false);
        navigation.navigate('GetStarted');
      }, 1500);
    }, 1000);
  };

  return (
    <ScreenWrapper
      scrollEnabled
      headerUnScrollable={() => (
        <View>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reset Password</Text>
          </View>
          <View>
            <Text style={styles.headerText}>
              Please enter your email address. You will receive a link to create
              a new password via email.
            </Text>
          </View>
        </View>
      )}
      footerUnScrollable={() => (
        <View style={styles.footerContainer}>
          <CustomButton
            title="Update"
            loading={loading}
            onPress={handleSetNewPassword}
            disabled={
              !state.password ||
              !state.confirmPassword ||
              Object.values(errors).some((error) => error !== '')
            }
          />
        </View>
      )}
    >
      <View style={{ paddingTop: 20 }}>
        <CustomText label="Password" fontSize={15} marginBottom={8} fontWeight='400'/>
        <CustomInput
          placeholder="********"
          value={state.password}
          onChangeText={(text) =>
            setState({ ...state, password: text })
          }
          error={errors.passwordError}
          secureTextEntry
        />

        <CustomText
          label="Confirm Password"
          fontSize={15}
          marginBottom={8}
          marginTop={0}
          fontWeight='400'
        />
        <CustomInput
          placeholder="********"
          value={state.confirmPassword}
          onChangeText={(text) =>
            setState({ ...state, confirmPassword: text })
          }
          error={errors.confirmPasswordError}
          secureTextEntry
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPass;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    justifyContent: 'flex-start',
    position: 'relative',
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    fontFamily: fonts.medium,
    marginTop:40
  },
  headerText: {
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginVertical: 20,
    width: 335,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
