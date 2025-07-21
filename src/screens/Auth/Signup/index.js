import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";

// Import custom components
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import ScreenWrapper from "../../../components/ScreenWrapper";
import UploadImageUI from "../../../components/UploadImageUI";
import Dropdown from "../../../components/Dropdown";
import OTPComponent from "../../../components/OTP";
import fonts from "../../../assets/fonts";
import { post } from "../../../services/ApiRequest";
import { showSuccess, showError } from "../../../utils/toast";

const Signup = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [cityTouched, setCityTouched] = useState(false); // Track city dropdown interaction
  const scrollViewRef = React.useRef(null);

  const [documents, setDocuments] = useState({
    icFront: null,
    icBack: null,
    licenseFront: null,
    licenseBack: null,
    psvLicense: null,
    jobPermit: null,
  });

  const handleDocumentUpload = (type) => (url) => {
    console.log(`${type} uploaded:`, url);
    setDocuments((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  // City options for dropdown
  const cityOptions = [
    
    { label: "Kuala Lumpur", value: "kuala_lumpur" },
    { label: "Penang", value: "penang" },
    { label: "Johor Bahru", value: "johor_bahru" },
    { label: "Ipoh", value: "ipoh" },
  ];

  // Main form state
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    plate: "",
    model: "",
    registrationNumber: "",
    cnic: "",
    document: null,
    accountNumber: "",
    selectedBank: "",
    selectedArea: "",
    selectedCity: "",
  });

  // Documents state to store uploaded image URLs
  const [errors, setErrors] = useState({});

  // Bank options
  const bankOptions = [
    { label: "Select Bank", value: "" },
    { label: "Maybank", value: "maybank" },
    { label: "CIMB Bank", value: "cimb" },
    { label: "Public Bank", value: "public_bank" },
    { label: "RHB Bank", value: "rhb" },
    { label: "Hong Leong Bank", value: "hong_leong" },
  ];

  // Area options updated to match provided JSON
  const areaOptions = [
    { label: "Select Area", value: "" },
    { label: "City Transport", value: "City Transport" },
    { label: "Intercity", value: "Intercity" },
    { label: "Klang", value: "Klang" },
    { label: "Intercity", value: "Intercity" },
  ];

  // // Load form data from AsyncStorage on mount
  // useEffect(() => {
  //   const loadFormData = async () => {
  //     try {
  //       const formData = await AsyncStorage.getItem("signupForm");
  //       const docData = await AsyncStorage.getItem("documents");
  //       if (formData) {
  //         const parsedData = JSON.parse(formData);
  //         if (!parsedData.selectedCity || parsedData.selectedCity === "") {
  //           parsedData.selectedCity = "kuala_lumpur";
  //         }
  //         setState(parsedData);
  //         console.log("Loaded form data:", parsedData);
  //       }
  //       if (docData) {
  //         const parsedDocuments = JSON.parse(docData);
  //         setDocuments(parsedDocuments);
  //         console.log("Loaded documents:", parsedDocuments);
  //       }
  //     } catch (error) {
  //       console.error("Failed to load form data:", error);
  //       Alert.alert("Error", "Failed to load saved data. Please try again.");
  //     }
  //   };
  //   loadFormData();
  // }, []);

  // // Save form data whenever state changes
  // useEffect(() => {
  //   const saveFormData = async () => {
  //     try {
  //       await AsyncStorage.setItem("signupForm", JSON.stringify(state));
  //       await AsyncStorage.setItem("documents", JSON.stringify(documents));
  //       console.log("Form data saved successfully");
  //     } catch (error) {
  //       console.error("Failed to save form data:", error);
  //     }
  //   };

  //   if (state.firstName || state.email || state.phoneNumber) {
  //     saveFormData();
  //   }
  // }, [state, documents]);

  const updateState = (field, value) => {
    console.log(`Updating ${field} with value:`, value);
    setState((prev) => {
      const newState = { ...prev, [field]: value };
      // console.log(`Updated state for ${field}:`, newState[field]);
      // console.log("Full updated state:", newState);
      return newState;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        // console.log(`Cleared error for ${field}`);
        return newErrors;
      });
    }
  };

  // Validation function
  const validateStep = (stepNumber) => {
    console.log(`Validating step ${stepNumber}`);
    console.log("Current state during validation:", state);

    let hasErrors = false;
    let newErrors = {};

    if (stepNumber === 1) {
      if (!state.firstName.trim()) {
        newErrors.firstName = "First name is required";
        hasErrors = true;
      }
      if (!state.lastName.trim()) {
        newErrors.lastName = "Last name is required";
        hasErrors = true;
      }
      if (!state.email.trim()) {
        newErrors.email = "Email is required";
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(state.email.trim())) {
        newErrors.email = "Invalid email format";
        hasErrors = true;
      }
      if (!state.password.trim()) {
        newErrors.password = "Password is required";
        hasErrors = true;
      } else if (state.password.trim().length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        hasErrors = true;
      }
      if (!state.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
        hasErrors = true;
      } else if (state.password.trim() !== state.confirmPassword.trim()) {
        newErrors.confirmPassword = "Passwords do not match";
        hasErrors = true;
      }
      if (!state.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
        hasErrors = true;
      } else if (!/^\d{10,12}$/.test(state.phoneNumber.trim())) {
        newErrors.phoneNumber = "Invalid phone number (10-12 digits)";
        hasErrors = true;
      }

      console.log("Validating city - current value:", state.selectedCity);
      if (cityTouched && (!state.selectedCity || state.selectedCity === "")) {
        console.log("City validation failed - no city selected");
        newErrors.selectedCity = "Please select your city";
        hasErrors = true;
      } else {
        console.log(
          "City validation passed - selected city:",
          state.selectedCity
        );
      }
    }

    if (stepNumber === 2) {
      if (!otp.trim() || otp.length !== 6 || !/^\d{6}$/.test(otp.trim())) {
        newErrors.otp = "Please enter a valid 6-digit OTP";
        hasErrors = true;
      }
    }

    if (stepNumber === 3) {
      if (!state.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
        hasErrors = true;
      } else if (!/^\d{10,16}$/.test(state.accountNumber.trim())) {
        newErrors.accountNumber = "Invalid account number (10-16 digits)";
        hasErrors = true;
      }

      // if (!state.selectedArea) {
      //   newErrors.selectedArea = "Area selection is required";
      //   hasErrors = true;
      // }

      if (!documents.icFront || !documents.icBack) {
        newErrors.ic = "Both IC front and back are required";
        hasErrors = true;
      }

      if (!documents.licenseFront || !documents.licenseBack) {
        newErrors.license = "Both license front and back are required";
        hasErrors = true;
      }
    }

    console.log("Validation errors set:", newErrors);
    setErrors(newErrors);
    return hasErrors;
  };

  // Handle Send OTP verification
  const Sendotp = async () => {
    try {
      setLoading(true);
      const payload = {
        email: state.email,
        purpose: "registration",
        name: state.firstName + " " + state.lastName,
      };

      console.log("Send OTP Request Payload:", payload);
      const response = await post("auth/send-verification-otp", payload);
      console.log("Send OTP API Response:", response.data);

      setReceivedOtp(response.data.data.otp);
      showSuccess(`OTP sent to your email: ${response.data.data.otp}`);
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

  // Handle Verify OTP
  const Verifyotp = async () => {
    try {
      if (!otp || otp.length !== 6) {
        showError("Please enter a valid 6-digit OTP");
        return false;
      }

      setLoading(true);
      const payload = {
        email: state.email,
        purpose: "registration",
        otp,
      };

      console.log("Verify OTP Request Payload:", payload);
      const response = await post("auth/verify-otp", payload);
      console.log("Verify OTP API Response:", response.data);

      setVerificationToken(response.data.data.verificationToken);
      await AsyncStorage.setItem(
        "verificationToken",
        response.data.data.verificationToken
      );
      showSuccess(`OTP verified successfully! ${response.data.data.otp}`);
      return true;
    } catch (error) {
      console.error("Verify OTP Error:", {
        response: error.response?.data,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify OTP";
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Handle signup submission
  const submitSignup = async () => {
    try {
      if (
        !documents.icFront ||
        !documents.icBack ||
        !documents.licenseFront ||
        !documents.licenseBack
      ) {
        showError("Please upload all required documents");
        return;
      }

      const data = {
        email: state.email.toLowerCase().trim(),
        phone: state.phoneNumber.startsWith("")
          ? state.phoneNumber
          : `+${state.phoneNumber}`,
        name: `${state.firstName} ${state.lastName}`.trim(),
        password: state.password,
        verificationToken: verificationToken,
        driverType: "ASRA",
        personalIdFrontUrl: documents.icFront,
        personalIdBackUrl: documents.icBack,
        driverLicenseFrontUrl: documents.licenseFront,
        driverLicenseBackUrl: documents.licenseBack,
        ...(documents.psvLicense && {
          psvLicenseFrontUrl: documents.psvLicense,
        }),
        ...(documents.jobPermit && { psvLicenseBackUrl: documents.jobPermit }),
        operations: [state.selectedCity], // Just use the stored city name
        bankDetails: {
          bankName:
            bankOptions.find((bank) => bank.value === state.selectedBank)
              ?.label || "",
          accountNumber: state.accountNumber,
          accountHolderName: `${state.firstName} ${state.lastName}`.trim(),
        },
        isCarOwner: false,
      };

      console.log("Signup Request Payload:", JSON.stringify(data, null, 2));

      setLoading(true);
      const response = await post("auth/register/rider", data);
      console.log("Signup API Response:", response.data);

      await AsyncStorage.removeItem("signupForm");
      await AsyncStorage.removeItem("documents");

      showSuccess("Registration completed successfully!");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Signup Error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "Failed to complete registration";

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors)
          .flat()
          .map((err) =>
            typeof err === "string" ? err : err.msg || "Validation error"
          )
          .join("\n");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const payload = {
        email: state.email,
        purpose: "registration",
        name: state.firstName + " " + state.lastName,
      };

      console.log("Resend OTP Request Payload:", payload);
      const response = await post("auth/send-verification-otp", payload);
      console.log("Resend OTP API Response:", response);
      showSuccess("OTP resent to your email");
    } catch (error) {
      console.error("Resend OTP Error:", {
        response: error.response?.data,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle next step
  const handleNext = async () => {
    console.log("Handle next called for step:", step);
    console.log("Current state before validation:", state);

    const hasErrors = validateStep(step);
    if (hasErrors) {
      console.log("Validation errors:", errors);
      if (errors.selectedCity) {
        Alert.alert("Validation Error", "Please select a valid city.");
      } else {
        Alert.alert(
          "Validation Error",
          "Please fill all required fields correctly."
        );
      }
      return;
    }

    if (step === 1) {
      const otpSent = await Sendotp();
      if (!otpSent) return;
    }

    if (step === 2) {
      const isOtpVerified = await Verifyotp();
      if (!isOtpVerified) return;
    }

    if (step < 3) {
      setStep((prevStep) => {
        const nextStep = prevStep + 1;
        console.log(`Moving to step ${nextStep}`);
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
        setErrors({});
        return nextStep;
      });
    }
  };

  // Handle signup
  const handleSignup = async () => {
    console.log("Handle signup called");
    console.log("Current state before final validation:", state);

    const hasErrors = validateStep(3);
    if (hasErrors) {
      console.log("Validation errors on signup:", errors);
      Alert.alert(
        "Validation Error",
        "Please fill all required fields correctly."
      );
      return;
    }

    await submitSignup();
  };

  // Render progress bar
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
    </View>
  );

  // Step rendering functions
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.step1}>Step 1 of 3</Text>
        <Text style={styles.stepTitle}>Nice to meet you!</Text>
        <Text style={styles.stepSubtitle}>Please tell us more about you</Text>

        <CustomText
          label="First Name"
          fontSize={15}
          marginTop={30}
          fontWeight="500"
        />
        <CustomInput
          placeholder="First Name"
          marginTop={10}
          value={state.firstName}
          onChangeText={(text) => updateState("firstName", text)}
          error={errors.firstName}
          containerStyle={errors.firstName ? styles.errorBorder : {}}
        />

        <CustomText
          label="Last Name"
          fontSize={15}
          marginTop={15}
          fontWeight="500"
        />
        <CustomInput
          placeholder="Last Name"
          marginTop={10}
          value={state.lastName}
          onChangeText={(text) => updateState("lastName", text)}
          error={errors.lastName}
          containerStyle={errors.lastName ? styles.errorBorder : {}}
        />

        <CustomText
          label="Email Address"
          fontSize={15}
          marginTop={15}
          fontWeight="500"
        />
        <CustomInput
          placeholder="Your Email Address"
          marginTop={10}
          keyboardType="email-address"
          autoCapitalize="none"
          value={state.email}
          onChangeText={(text) => updateState("email", text)}
          error={errors.email}
          containerStyle={errors.email ? styles.errorBorder : {}}
        />

        <CustomText
          label="Phone Number"
          fontSize={15}
          marginTop={15}
          fontWeight="500"
        />
        <CustomInput
          placeholder="Phone Number"
          marginTop={10}
          keyboardType="phone-pad"
          value={state.phoneNumber}
          onChangeText={(text) => updateState("phoneNumber", text)}
          error={errors.phoneNumber}
          containerStyle={errors.phoneNumber ? styles.errorBorder : {}}
        />

        <CustomText
          label="Password"
          fontSize={15}
          marginTop={15}
          fontWeight="500"
        />
        <CustomInput
          placeholder="Password"
          marginTop={10}
          secureTextEntry
          value={state.password}
          onChangeText={(text) => updateState("password", text)}
          error={errors.password}
          containerStyle={errors.password ? styles.errorBorder : {}}
        />

        <CustomText
          label="Confirm Password"
          fontSize={15}
          marginTop={15}
          fontWeight="500"
        />
        <CustomInput
          placeholder="Confirm Password"
          marginTop={10}
          secureTextEntry
          value={state.confirmPassword}
          onChangeText={(text) => updateState("confirmPassword", text)}
          error={errors.confirmPassword}
          containerStyle={errors.confirmPassword ? styles.errorBorder : {}}
        />

        <CustomText
          label="City"
          fontSize={15}
          marginTop={15}
          fontWeight="500"
        />
        <View style={styles.dropdownContainer}>
          <Dropdown
            items={cityOptions}
            defaultValue={state.selectedCity}
            onSelectItem={(value) => {
              console.log("Selected city:", value);
              updateState("selectedCity", value.value);
            }}
            placeholder="Select your city"
            style={[styles.dropdown, errors.selectedCity && styles.errorBorder]}
            dropDownContainerStyle={{
              position: "absolute",
              width: "100%",
              zIndex: 1000,
              elevation: 5,
            }}
          />
          {errors.selectedCity && (
            <Text style={[styles.errorText, { fontWeight: "bold" }]}>
              {errors.selectedCity}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Continue"
          onPress={handleNext}
          loading={loading}
          disabled={loading}
          customStyle={styles.button}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.otpContainer}>
          <CustomText
            label={`Enter 6-digit code we just texted to your phone number ${state.phoneNumber}`}
            fontFamily={fonts.medium}
            marginBottom={30}
            marginTop={10}
            lineHeight={24}
            fontSize={16}
            textAlign="center"
          />

          <OTPComponent value={otp} setValue={setOtp} />

          {__DEV__ && receivedOtp ? (
            <View>
              <Text style={styles.devOtpText}>OTP is {receivedOtp}</Text>
            </View>
          ) : null}

          {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

          <View style={styles.resendContainer}>
            <TouchableOpacity
              onPress={handleResendOTP}
              accessibilityLabel="Resend OTP"
              disabled={loading}
            >
              <Text style={[styles.resendText, loading && styles.disabledText]}>
                Resend code
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Verify"
          onPress={handleNext}
          loading={loading}
          disabled={loading}
          customStyle={styles.button}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.documentsTitle}>Upload Documents</Text>

        <View style={styles.documentSection}>
          <Text style={styles.documentTitle}>ID (Front & Back)</Text>
          <View style={styles.uploadGrid}>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Front</Text>
              <UploadImageUI
                label="Upload Profile Picture"
                onUploadComplete={handleDocumentUpload("icFront")}
                initialImage={documents.icFront}
              />
            </View>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Back</Text>
              <UploadImageUI
                onUploadComplete={handleDocumentUpload("icBack")}
                label="ID Back (Required)"
                initialImage={documents.icBack}
              />
            </View>
          </View>
          {errors.ic && <Text style={styles.errorText}>{errors.ic}</Text>}
        </View>

        <View style={styles.documentSection}>
          <Text style={styles.documentTitle}>
            Driving License (Front & Back)
          </Text>
          <View style={styles.uploadGrid}>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Front</Text>
              <UploadImageUI
                onUploadComplete={handleDocumentUpload("licenseFront")}
                label="License Front (Required)"
                initialImage={documents.licenseFront}
              />
            </View>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Back</Text>
              <UploadImageUI
                onUploadComplete={handleDocumentUpload("licenseBack")}
                label="License Back (Required)"
                initialImage={documents.licenseBack}
              />
            </View>
          </View>
          {errors.license && (
            <Text style={styles.errorText}>{errors.license}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.documentButton}>
            <Text style={styles.documentButtonText}>PSV License Front</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("psvLicense")}
              label="PSV License front"
              compact={true}
              initialImage={documents.psvLicense}
            />
          </View>

          <View style={styles.documentButton}>
            <Text style={styles.documentButtonText}>PSV License Back</Text>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("jobPermit")}
              label="PSV License Back"
              compact={true}
              initialImage={documents.jobPermit}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              items={bankOptions}
              defaultValue={state.selectedBank}
              onSelectItem={(value) => {
                console.log("Selected bank:", value);
                updateState("selectedBank", value.value);
              }}
              placeholder="Select Bank"
              style={[
                styles.dropdown,
                errors.selectedBank && styles.errorBorder,
              ]}
              dropDownContainerStyle={{
                position: "absolute",
                width: "100%",
                zIndex: 1000,
                elevation: 5,
              }}
            />
            {errors.selectedBank && (
              <Text style={[styles.errorText, { fontWeight: "bold" }]}>
                {errors.selectedBank}
              </Text>
            )}
          </View>

          <TextInput
            style={[
              styles.textInput,
              errors.accountNumber ? styles.errorBorder : {},
            ]}
            placeholder="Account Number"
            value={state.accountNumber}
            onChangeText={(text) => updateState("accountNumber", text)}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          {errors.accountNumber && (
            <Text style={styles.errorText}>{errors.accountNumber}</Text>
          )}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Area of Operation</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              items={areaOptions}
              defaultValue={state.selectedArea}
              onSelectItem={(value) => {
           
                console.log("New area value:", value);
                
                // Set the selected value in state
                setState(prev => ({
                  ...prev,
                  selectedArea: value
                }));
                
                
             
                
                
              }}
              placeholder="Select Area"
              dropDownContainerStyle={{
                position: 'absolute',
                width: '100%',
                zIndex: 1000,
                elevation: 5,
              }}
              style={{
                zIndex: 1000,
                elevation: 5,
              }}
            />
          </View>
        </View> */}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Complete Registration"
          onPress={handleSignup}
          loading={loading}
          disabled={loading}
          customStyle={styles.button}
        />
      </View>
    </View>
  );

  // Render step
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScreenWrapper scrollEnabled={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              accessibilityLabel="Go back"
            >
              <AntDesign name="left" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.stepText}>Step {step} of 3</Text>
          </View>
          {renderProgressBar()}
          <View style={styles.stepContent}>{renderStep()}</View>
        </ScreenWrapper>
      </KeyboardAvoidingView>
      <FlashMessage position="top" style={{ marginTop: 30 }} />
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
  },
  stepText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: "auto",
    marginRight: "auto",
    color: "#1F2937",
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    marginBottom: 10,
  },
  progressContainer: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginHorizontal: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  stepContent: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    overflow: "hidden",
  },
  step1: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 20,
  },
  dropdownContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  errorBorder: {
    borderColor: "#EF4444",
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  otpContainer: {
    alignItems: "center",
    paddingHorizontal: 2,
  },
  devOtpText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
  resendContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resendText: {
    fontSize: 16,
    color: "#10B981",
    fontWeight: "600",
  },
  disabledText: {
    color: "#6B7280",
    opacity: 0.6,
  },
  documentsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  documentSection: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  uploadGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  uploadItem: {
    flex: 1,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  documentButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  documentButtonText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
    fontWeight: "500",
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#374151",
  },
});

export default Signup;
