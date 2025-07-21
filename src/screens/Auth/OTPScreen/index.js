import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import OTPComponent from '../../../components/OTP';
import ScreenWrapper from '../../../components/ScreenWrapper';
import fonts from '../../../assets/fonts';
import { post } from '../../../services/ApiRequest';
import { COLORS } from '../../../utils/COLORS';
import { showError, showSuccess } from '../../../utils/toast';

const OTPScreen = ({ route, navigation }) => {
  const isAccountCreated = route.params?.isAccountCreated;

  const email = route.params?.email;

  const keyboardHeight = new Animated.Value(0);
  const timerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [otp, setOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

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

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      // Replace with your actual OTP resend API endpoint
      await post('auth/resend-otp', { email, purpose: 'password-reset' });
      showSuccess('OTP resent successfully!');
      startTimer();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const Verifyotp = async () => {
    try {
      if (!otp || otp.length !== 6) {
        showError("Please enter a valid 6-digit OTP");
        return;
      }

      setLoading(true);
      const payload = { 
        email, 
        purpose: "password-reset", 
        otp 
      };

      const response = await post("auth/verify-otp", payload);
      const verificationToken = response.data.data?.verificationToken;
      
      if (!verificationToken) {
        throw new Error("Verification token not found in response");
      }

      await AsyncStorage.setItem("verificationToken", verificationToken);
      
      if (isAccountCreated) {
        navigation.navigate("NewPass", { 
          email, 
          token: verificationToken 
        });
      } else {
        // Navigate to appropriate screen after successful verification
        navigation.navigate("NewPass", { 
          email, 
          token: verificationToken 
        });
      }
      
      showSuccess("OTP verified successfully!");
      
    } catch (error) {
      console.error("Verify OTP Error:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to verify OTP';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenWrapper
          scrollEnabled={false}
          footerUnScrollable={() => (
            <View style={styles.footer}>
              <CustomButton
                title="Verify"
                marginTop={20}
                onPress={Verifyotp}
                loading={loading}
                disabled={!otp || otp.length !== 6}
              />
              <View style={styles.resendContainer}>
                <CustomText
                  label="Didn't receive code?"
                  fontSize={14}
                  color={COLORS.gray}
                />
                <TouchableOpacity 
                  onPress={handleResendOTP}
                  disabled={timer > 0 || resendLoading}
                >
                  <CustomText
                    label={timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
                    fontSize={14}
                    color={timer > 0 ? COLORS.gray : COLORS.primary}
                    fontFamily={fonts.bold}
                    marginLeft={5}
                    style={{ opacity: timer > 0 ? 0.6 : 1 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          headerUnScrollable={() => (
            <Header 
              title="Verification Code" 
              onBackPress={() => navigation.goBack()}
            />
          )}
        >
          <View style={styles.container}>
            <CustomText
              label="Enter Verification Code"
              fontSize={24}
              fontFamily={fonts.bold}
              marginBottom={10}
            />
            <CustomText
              label={`We've sent a 6-digit verification code to ${email || 'your email'}`}
              fontSize={14}
              color={COLORS.gray}
              marginBottom={40}
            />
            
            <OTPComponent value={otp} setValue={setOtp} />
          </View>
        </ScreenWrapper>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 2,
    paddingTop: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default OTPScreen;