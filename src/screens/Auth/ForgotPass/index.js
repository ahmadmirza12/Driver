import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";

import fonts from "../../../assets/fonts";
import { COLORS } from "../../../utils/COLORS";
import { regEmail } from "../../../utils/constants";
import { post } from "../../../services/ApiRequest";
import { showSuccess, showError } from "../../../utils/toast";

const ForgotPass = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");

  const validateEmail = (email) => {
    if (!email) {
      setError("Please enter email address");
      return false;
    } else if (!regEmail.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const Sendotp = async () => {
    // Validate email before proceeding
    if (!validateEmail(email)) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        email: email.trim(),
        purpose: "password-reset",
      };

      console.log("Send OTP Request Payload:", JSON.stringify(payload, null, 2));
      
      const response = await post("auth/send-verification-otp", payload);
      
      if (!response || !response.data) {
        throw new Error("No response received from server");
      }

      console.log("Send OTP API Response:", JSON.stringify(response.data, null, 2));

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send OTP");
      }

      if (!response.data.data?.otp) {
        throw new Error("No OTP received from server");
      }

      const otp = response.data.data.otp;
      setReceivedOtp(otp);
      showSuccess(`OTP sent to your email`);
      
      navigation.navigate("OTPScreen", {
        email: email.trim(),
        receivedOtp: otp,
      });
      
      return true;
    } catch (error) {
      console.error("Send OTP Error:", {
        error: error.toString(),
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        }
      });
      
      let errorMessage = "Failed to send OTP. Please try again.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your internet connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message || errorMessage;
      }
      
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot Password</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.headerText}>
          Please enter your email address. You will receive a link to create a
          new password via email.
        </Text>

        <Text style={styles.EmailText}>Email Address</Text>
        <CustomInput
          onChangeText={handleEmailChange}
          value={email}
          error={error}
          placeholder="Your Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <CustomButton
          title="Send"
          onPress={Sendotp}
          loading={loading}
          disabled={!email.trim()} // Only disable if email is empty
        />
      </View>
    </View>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#E8F6F2",
    padding: 20,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    justifyContent: "flex-start",
    position: "relative",
    paddingTop: 10,
  },
  headerTitle: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
    fontFamily: fonts.medium,
  },
  content: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    color: "gray",
    marginTop: 25,
    marginBottom: 20,
    width: 300,
  },
  EmailText: {
    fontSize: 16,
    paddingHorizontal: 5,
    marginBottom: 10,
    fontWeight: "500",
    marginTop: 10,
  },
  footer: {
    paddingBottom: 10,
  },
});
