import { AntDesign } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
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

  

  const errorCheck = useMemo(() => {
    return () => {
      let newErrors = "";
      if (!email) newErrors = "Please enter email address";
      else if (!regEmail.test(email))
        newErrors = "Please enter a valid email address";
      setError(newErrors);
    };
  }, [email]);

  const Sendotp = async () => {
    try {
      setLoading(true);
      const payload = {
        email: email,
        purpose: "password-reset",
      };

      console.log("Send OTP Request Payload:", payload);
      const response = await post("auth/send-verification-otp", payload);
      console.log("Send OTP API Response:", response.data);

      setReceivedOtp(response.data.data.otp);
      showSuccess(`OTP sent to your email: ${response.data.data.otp}`);
      navigation.navigate("OTPScreen", {
        email,
        receivedOtp,
      });
      return true;
    } catch (error) {
      console.error("Send OTP Error:", {
        response: error.response?.data,
      });
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to send OTP";
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    errorCheck();
  }, [errorCheck]);

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
          onChangeText={setEmail}
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
          disabled={!!error}
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
