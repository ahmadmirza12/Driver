import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import ScreenWrapper from "../../../components/ScreenWrapper";
import UploadImageUI from "../../../components/UploadImageUI";

const Signup = ({ navigation }) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    phoneNumber: "",
    vehicleType: "",
    vehicleNumber: "",
    plate: "",
    model: "",
    registrationNumber: "",
    cnic: "",
    document: null,
  });

  const [errors, setErrors] = useState({});

  const validateStep = (stepNumber) => {
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
      if (!state.age.trim()) {
        newErrors.age = "Age is required";
        hasErrors = true;
      }
      if (!state.email.trim()) {
        newErrors.email = "Email is required";
        hasErrors = true;
      } else if (!/\S+@\S+\.\S+/.test(state.email)) {
        newErrors.email = "Invalid email format";
        hasErrors = true;
      }
      if (!state.password.trim()) {
        newErrors.password = "Password is required";
        hasErrors = true;
      } else if (state.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
        hasErrors = true;
      }
      if (!state.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    return hasErrors;
  };

  const handleNext = () => {
    const hasErrors = validateStep(step);
    if (!hasErrors) setStep((prev) => prev + 1);
  };

  const handleSignup = async () => {
    const fcmtoken = await AsyncStorage.getItem("fcmToken");
    navigation.navigate("AllDone", {
      isAccountCreated: false,
      signupData: state,
      fcmtoken,
    });
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]} />
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.CaseText}>Nice to meet you!</Text>
            <Text style={styles.label}>Please tell us more about you</Text>

            <CustomText label="First Name" fontSize={15} marginTop={30} fontWeight="500" />
            <CustomInput
              placeholder="Name"
              marginTop={10}
              value={state.firstName}
              onChangeText={(text) => setState((prev) => ({ ...prev, firstName: text }))}
              error={errors.firstName}
            />

            <CustomText label="Surname" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Surname"
              marginTop={10}
              value={state.lastName}
              onChangeText={(text) => setState((prev) => ({ ...prev, lastName: text }))}
              error={errors.lastName}
            />

            <CustomText label="Age" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Age"
              marginTop={10}
              keyboardType="numeric"
              value={state.age}
              onChangeText={(text) => setState((prev) => ({ ...prev, age: text }))}
              error={errors.age}
            />

            <CustomText label="Password" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Password"
              marginTop={10}
              secureTextEntry
              value={state.password}
              onChangeText={(text) => setState((prev) => ({ ...prev, password: text }))}
              error={errors.password}
            />

            <CustomText label="Email Address" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Your Email Address"
              marginTop={10}
              keyboardType="email-address"
              value={state.email}
              onChangeText={(text) => setState((prev) => ({ ...prev, email: text }))}
              error={errors.email}
            />

            <CustomText label="Phone Number" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Number"
              marginTop={10}
              keyboardType="phone-pad"
              value={state.phoneNumber}
              onChangeText={(text) => setState((prev) => ({ ...prev, phoneNumber: text }))}
              error={errors.phoneNumber}
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text style={styles.CaseText}>Vehicle Info</Text>
            <Text style={styles.label}>Please tell us more about you</Text>

            <CustomText label="Vehicle Type" fontSize={15} marginTop={30} fontWeight="500" />
            <CustomInput
              placeholder="Type"
              marginTop={10}
              value={state.vehicleType}
              onChangeText={(text) => setState((prev) => ({ ...prev, vehicleType: text }))}
              error={errors.vehicleType}
            />

            <CustomText label="Number" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Number"
              marginTop={10}
              value={state.vehicleNumber}
              onChangeText={(text) => setState((prev) => ({ ...prev, vehicleNumber: text }))}
              error={errors.vehicleNumber}
            />

            <CustomText label="Plate" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Plate"
              marginTop={10}
              value={state.plate}
              onChangeText={(text) => setState((prev) => ({ ...prev, plate: text }))}
              error={errors.plate}
            />

            <CustomText label="Model" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Model"
              marginTop={10}
              value={state.model}
              onChangeText={(text) => setState((prev) => ({ ...prev, model: text }))}
              error={errors.model}
            />
          </View>
        );

      case 3:
        return (
          <View>
            <Text style={styles.CaseText}>Documents Upload</Text>
            <Text style={styles.label}>Please upload documents of your car</Text>

            <CustomText
              label="Vehicle Registration"
              fontSize={15}
              marginTop={30}
              fontWeight="500"
            />
            <CustomInput
              placeholder="Number"
              marginTop={10}
              value={state.registrationNumber}
              onChangeText={(text) =>
                setState((prev) => ({ ...prev, registrationNumber: text }))
              }
              error={errors.registrationNumber}
            />

            <CustomText
              label="Upload Driver License"
              fontSize={15}
              fontWeight={500}
              marginBottom={10}
            />
            <UploadImageUI />

            <CustomText
              label="Insurance Document"
              fontSize={15}
              fontWeight={500}
              marginBottom={10}
              marginTop={20}
            />
            <UploadImageUI />

            <CustomText label="CNIC" fontSize={15} marginTop={10} fontWeight="500" />
            <CustomInput
              placeholder="Number"
              marginTop={10}
              value={state.cnic}
              onChangeText={(text) => setState((prev) => ({ ...prev, cnic: text }))}
              error={errors.cnic}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScreenWrapper scrollEnabled>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step {step}</Text>
      </View>

      {renderProgressBar()}

      {renderStep()}

      <CustomButton
        title={step < 3 ? "Continue" : "Done"}
        onPress={step < 3 ? handleNext : handleSignup}
        loading={loading}
        marginTop={20}
        marginBottom={20}
      />
    </ScreenWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  progressContainer: {
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginVertical: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#1E4D3D",
    borderRadius: 10,
  },
  CaseText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    top: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 10,
  },
  stepText: {
    fontSize: 18,
    fontWeight: "400",
    marginLeft: 120,
  },
});
