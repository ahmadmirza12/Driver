import { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';

import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import DualText from '../../../components/DualText';
import Header from '../../../components/Header';
import ScreenWrapper from '../../../components/ScreenWrapper';

import fonts from '../../../assets/fonts';
import CustomInput from '../../../components/CustomInput';
import { setLocation } from '../../../store/reducer/usersSlice';
import GetLocation from '../../../utils/GetLocation';
import { regEmail } from '../../../utils/constants';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const locationData = GetLocation();

  const init = {
    email: '',
    password: '',
  };

  const inits = {
    emailError: '',
    passwordError: '',
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(inits);
  const [state, setState] = useState(init);

  const handleLogin = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainStack' }],
    });
  };

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = {};
      if (!state.email) newErrors.emailError = 'Please enter Email address';
      else if (!regEmail.test(state.email))
        newErrors.emailError = 'Please enter valid email';

      if (!state.password)
        newErrors.passwordError = 'Please enter Password';
      else if (state.password.length < 8)
        newErrors.passwordError = 'Password must be 8 digits';

      setErrors(newErrors);
    };
  }, [state]);

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

  useEffect(() => {
    dispatch(setLocation(locationData));
  }, [locationData]);

  return (
    <ScreenWrapper
      backgroundColor="#E8F6F2"
      statusBarColor="#E8F6F2"
      headerUnScrollable={() => (
        <View style={styles.headerContainer}>
          <Header title="Login" />
        </View>
      )}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <View
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <CustomText
              label="Login to Your Account"
              fontSize={18}
              marginBottom={15}
              fontFamily={fonts.semiBold}
            />

            <CustomText label="Email Address" fontSize={16} marginBottom={8} />
            <CustomInput
              placeholder="Enter Your Email"
              value={state.email}
              onChangeText={(text) => setState({ ...state, email: text })}
              error={errors.emailError}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <CustomText
              label="Password"
              fontSize={16}
              marginBottom={8}
            />
            <CustomInput
              placeholder="Password"
              value={state.password}
              onChangeText={(text) => setState({ ...state, password: text })}
              error={errors.passwordError}
              secureTextEntry
            />

            <View style={styles.forgetPasswordView}>
              <CustomText
                label="Forgot Password?"
                fontFamily={fonts.bold}
                fontSize={14}
                color="#007BFF"
                onPress={() => navigation.navigate('ForgotPass')}
              />
            </View>

            <CustomButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              disabled={Object.keys(errors).some((key) => errors[key] !== '')}
              marginTop={30}
              marginBottom={30}
              backgroundColor="#1F5546"
            />
          </View>

          <View style={styles.bottomText}>
            <DualText
              title="Don’t have an account?"
              secondTitle="Create New"
              onPress={() => navigation.navigate('Signup')}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 35 : 0,
    backgroundColor: '#E8F6F2',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  formContainer: {
    marginTop: 20,
  },
  forgetPasswordView: {
    alignItems: 'flex-end',
  },
  bottomText: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
