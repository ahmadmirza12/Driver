import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../../components/CustomText";
import CustomInput from "../../../components/CustomInput";
import { regEmail } from "../../../utils/constants";
import { get } from "../../../services/ApiRequest";

export default function GetStarted() {
  const navigation = useNavigation();
  const [state, setState] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
  });

  // Validate email function
  const validateEmail = (email) => {
    if (!email) {
      return "Please enter Email address";
    } else if (!regEmail.test(email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  // Handle email availability check
  const handleCheckEmail = async () => {
    const emailError = validateEmail(state.email);
    
    if (emailError) {
      setErrors({ emailError });
      return;
    }

    try {
      const response = await get("auth/email-availability", {
        email: state.email,
      });
      console.log("API Response:", response.data);

      navigation.navigate("Signup");
      // navigation.navigate("Login");
    } catch (error) {
      console.error(
        "Error checking email:",
        error.response?.data || error.message
      );
      setErrors({
        emailError:
          error.response?.data?.message || "Error checking email availability",
      });
    }
  };

  // Update email state and clear error when typing
  const handleEmailChange = (text) => {
    setState({ ...state, email: text });
    // Clear error when user starts typing
    if (errors.emailError) {
      setErrors({ emailError: "" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.backIconWrapper}></View>

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
          marginTop={15}
        />
      </View>

      <CustomText label="Email Address" fontSize={16} marginBottom={8} marginTop={11} />
      <CustomInput
        placeholder="Enter Your Email"
        value={state.email}
        onChangeText={handleEmailChange}
        error={errors.emailError}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <CustomText
        label="You will receive an SMS verification that may apply message and data rates."
        fontSize={14}
        fontWeight="400"
        color="#727272"
        marginTop={10}
      />
      <TouchableOpacity
        onPress={handleCheckEmail}
        style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
        disabled={!!errors.emailError || !state.email} // Disable button if invalid
      >
        <Image
          source={require("../../../assets/images/ArrowRight.png")}
          style={{ width: 48, height: 48, marginTop: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
    padding: 20,
  },
  backIconWrapper: {
    paddingTop: 20,
  },
});
