import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CustomButton from '../../../components/CustomButton';
import CustomInput from '../../../components/CustomInput';
import ScreenWrapper from '../../../components/ScreenWrapper';

import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import { COLORS } from '../../../utils/COLORS';
import { post } from '../../../services/ApiRequest';
import { showError, showSuccess } from '../../../utils/toast';

const NewPass = ({ navigation, route }) => {
  const email = route?.params?.email;
  const verificationToken = route?.params?.token;
  // console.log("Email:", email);
  // console.log("VerificationToken:", verificationToken);

  const [isModal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    passwordError: '',
    confirmPasswordError: '',
  });

  const validateInputs = () => {
    let newErrors = {};
    if (!state.password) newErrors.passwordError = 'Please enter password';
    else if (state.password.length < 8)
      newErrors.passwordError = 'Password must contain at least 8 characters';

    if (!state.confirmPassword)
      newErrors.confirmPasswordError = 'Please enter confirm password';
    else if (state.confirmPassword.length < 8)
      newErrors.confirmPasswordError = 'Password must contain at least 8 characters';
    else if (state.password !== state.confirmPassword)
      newErrors.confirmPasswordError = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSetNewPassword = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const payload = {
        email,
        verificationToken,
        newPassword: state.password,
      };
      const response = await post("auth/reset-password", payload);
      console.log("Reset Password API Response:", response.data);
      showSuccess("Password reset successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Reset Password Error:", {
        error: error.toString(),
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to reset password";
      showError(errorMessage);
    } finally {
      setLoading(false);
      setModal(true);
      setTimeout(() => {
        setModal(false);
      }, 1500);
    }
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
    marginTop: 40
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