import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

import CustomButton from "../../../components/CustomButton";
import CustomText from "../../../components/CustomText";
import DualText from "../../../components/DualText";
import Header from "../../../components/Header";
import ScreenWrapper from "../../../components/ScreenWrapper";

import fonts from "../../../assets/fonts";
import CustomInput from "../../../components/CustomInput";
import { setLocation } from "../../../store/reducer/usersSlice";
import { setToken, setUser } from "../../../store/reducer/AuthConfig";
import GetLocation from "../../../utils/GetLocation";
import { regEmail } from "../../../utils/constants";
import { post } from "../../../services/ApiRequest";
import { showSuccess, showError } from "../../../utils/toast";
import { FontAwesome } from "@expo/vector-icons";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const locationData = GetLocation();

  const init = {
    email: "",
    password: "",
  };

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });
  const [state, setState] = useState(init);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      emailError: "",
      passwordError: "",
    };

    // Email validation
    if (!state.email) {
      newErrors.emailError = "Please enter Email address";
      isValid = false;
    } else if (!regEmail.test(state.email)) {
      newErrors.emailError = "Please enter a valid email";
      isValid = false;
    }

    // Password validation
    if (!state.password) {
      newErrors.passwordError = "Please enter Password";
      isValid = false;
    } else if (state.password.length < 8) {
      newErrors.passwordError = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    dispatch(setLocation(locationData));
  }, [locationData]);

  const login = async () => {
    // Validate form before proceeding
    if (!validateForm()) {
      return;
    }

    const data = {
      email: state.email,
      password: state.password,
    };

    try {
      setLoading(true);
      const response = await post("auth/login", data);
      console.log("Login API Response:", response.data.data);
      dispatch(setUser(response.data.data.user));
      



      if (response.data.data.token) {
        // Dispatch token to Redux store
        dispatch(setToken(response.data.data.token));
      }

      setLoading(false);
      showSuccess("Login successful");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainStack" }],
      });
    } catch (error) {
      console.error("Login Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      showError(errorMessage);
    }
  };

  // Handle input changes and clear respective errors
  const handleEmailChange = (text) => {
    setState({ ...state, email: text });
    if (errors.emailError) {
      setErrors({ ...errors, emailError: "" });
    }
  };

  const handlePasswordChange = (text) => {
    setState({ ...state, password: text });
    if (errors.passwordError) {
      setErrors({ ...errors, passwordError: "" });
    }
  };

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
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
              onChangeText={handleEmailChange}
              error={errors.emailError}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <CustomText label="Password" fontSize={16} marginBottom={8} />
            <CustomInput
              placeholder="Password"
              value={state.password}
              onChangeText={handlePasswordChange}
              error={errors.passwordError}
              secureTextEntry
            />

            <View style={styles.forgetPasswordView}>
              <CustomText
                label="Forgot Password?"
                fontFamily={fonts.bold}
                fontSize={14}
                color="#007BFF"
                onPress={() => navigation.navigate("ForgotPass")}
              />
            </View>

            <CustomButton
              title="Login"
              onPress={login}
              loading={loading}
              marginTop={30}
              marginBottom={20}
              backgroundColor="#1F5546"
            />

            <View style={styles.socialLoginContainer}>
              <Text style={styles.divider}>Or login with</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                >
                  <FontAwesome name="google" size={20} color="#DB4437" />
                  <Text style={[styles.socialButtonText, { color: "#DB4437" }]}>
                    Google
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                >
                  <FontAwesome name="facebook" size={20} color="#4267B2" />
                  <Text style={[styles.socialButtonText, { color: "#4267B2" }]}>
                    Facebook
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.bottomText}>
            <DualText
              marginTop={100}
              marginBottom={20}
              title="Don't have an account?"
              secondTitle="Create New"
              onPress={() => navigation.navigate("Signup")}
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
    paddingTop: Platform.OS === "android" ? 35 : 0,
    backgroundColor: "#E8F6F2",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  formContainer: {
    // marginTop: 20,
  },
  forgetPasswordView: {
    alignItems: "flex-end",
  },
  bottomText: {
    alignItems: "center",
    // justifyContent: "flex-end",
  },
  socialLoginContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  divider: {
    color: "#666",
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "40%",
  },
  socialButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "white",
  },
  facebookButton: {
    backgroundColor: "white",
  },
});
