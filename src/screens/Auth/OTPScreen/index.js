import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import OTPComponent from '../../../components/OTP';
import ScreenWrapper from '../../../components/ScreenWrapper';

import fonts from '../../../assets/fonts';
import { post } from '../../../services/ApiRequest';
import { COLORS } from '../../../utils/COLORS';
import { ToastMessage } from '../../../utils/ToastMessage';

const OTPScreen = ({ route, navigation }) => {
  const isAccountCreated = route.params?.isAccountCreated;
  const signupData = route.params?.signupData;
  const token = route.params?.token;

  const keyboardHeight = new Animated.Value(0);
  const timerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    setTimer(59);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (isAccountCreated) {
      navigation.navigate('NewPass', { token, code: otp });
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleResendOtp = async () => {
    try {
      const body = {
        email: signupData?.email,
        type: 'customer',
      };
      const url = isAccountCreated
        ? 'users/forget-password'
        : 'users/send-code';
      const response = await post(url, body);
      ToastMessage(response.data?.message);
    } catch (error) {
      ToastMessage(error.response?.data?.message);
    }
    startTimer();
  };

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', event => {
      Animated.timing(keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenWrapper
        scrollEnabled
        footerUnScrollable={() => (
          <Animated.View
            style={{ marginBottom: keyboardHeight, paddingHorizontal: 20 }}>
            <CustomButton
              title="Verify"
              marginTop={40}
              marginBottom={20}
              loading={loading}
              disabled={!otp}
              onPress={handleVerifyOtp}
            />
          </Animated.View>
        )}
        headerUnScrollable={() => <Header title="Enter Authentication Code" marginTop={10}/>}
      >
        <CustomText
          label="Enter 5-digit code we just texted to your phone number (404)-123-4567"
          fontFamily={fonts.medium}
          marginBottom={30}
          marginTop={10}
          lineHeight={24}
          fontSize={16}
        />

        <OTPComponent value={otp} setValue={setOtp} />

        <View style={[styles.row, { marginBottom: 18 }]}>
          <CustomText
            label={timer !== 0 ? 'Resend code in' : ''}
            fontSize={16}
            fontFamily={fonts.medium}
          />
          <CustomText
            label={
              timer !== 0
                ? ` ${String(timer).padStart(2, '0')}s`
                : ' Resend Code '
            }
            marginBottom={-4}
            fontFamily={fonts.bold}
            fontSize={16}
            disabled={timer !== 0}
            onPress={handleResendOtp}
            color={timer === 0 ? '#1F5546' : '#999'}
          />
        </View>
      </ScreenWrapper>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? 0 : 0,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
});
