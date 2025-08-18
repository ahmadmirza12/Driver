"use client";

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import CustomText from "../../../components/CustomText";
import Dropdown from "../../../components/Dropdown";
import CustomCheckbox from "../../../components/CustomCheckBox";
import CustomInput from "../../../components/CustomInput";
import UploadImageUI from "../../../components/UploadImageUI";
import { ScrollView } from "react-native";
import CustomButton from "../../../components/CustomButton";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { post } from "../../../services/ApiRequest";
import { showSuccess, showError } from "../../../utils/toast";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Vehicle = () => {
  const route = useRoute();
  const { userData } = route.params || {};
  const navigation = useNavigation();

  const vehicleOptions = [
    { label: "Select Vehicle", value: "" },
    { label: "Car", value: "Sedan" },
    { label: "Bike", value: "bike" },
    { label: "Truck", value: "truck" },
    { label: "Bus", value: "bus" },
  ];

  const [state, setState] = useState({
    vehicleType: "",
    vehicleNumber: "",
    vehicleRegistrationNumber: "",
    vehicleModel: "",
    vehicleColor: "",
    vehicleRegistrationYear: "",
    vehicleEngineCC: "",
    vehiclePlateNumber: "",
    vehicleMileage: "",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [documentImages, setDocumentImages] = useState({
    grant: null,
    insurance: null,
    evp: null,
    front: null,
    back: null,
    left: null,
    right: null,
    interior: null,
    dashboard: null,
  });
  const [uploading, setUploading] = useState(false);

  const updateState = (field, value) => {
    setState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (type) => (url) => {
    setDocumentImages((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  const DocumentUploadItem = ({ title, type }) => {
    return (
      <UploadImageUI
        label={title}
        onUploadComplete={handleImageUpload(type)}
        initialImage={documentImages[type]}
        compact={true}
      />
    );
  };

  const PhotoUploadItem = ({ title, type }) => {
    return (
      <UploadImageUI
        label={title}
        onUploadComplete={handleImageUpload(type)}
        initialImage={documentImages[type]}
        compact={true}
      />
    );
  };

  const validateCarOwnerForm = () => {
    // Validate required fields for car owners
    const requiredFields = [
      "vehicleType",
      "vehicleNumber",
      "vehicleModel",
      "vehicleRegistrationYear",
      "vehicleEngineCC",
      "vehiclePlateNumber",
      "vehicleMileage",
      "vehicleColor",
    ];

    const newErrors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!state[field] || state[field].trim() === "") {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} is required`;
        hasErrors = true;
      }
    });

    // Validate vehicle type is not empty selection
    if (state.vehicleType === "") {
      newErrors.vehicleType = "Please select a vehicle type";
      hasErrors = true;
    }

    // Validate numeric fields
    if (
      state.vehicleRegistrationYear &&
      isNaN(Number.parseInt(state.vehicleRegistrationYear))
    ) {
      newErrors.vehicleRegistrationYear =
        "Registration year must be a valid number";
      hasErrors = true;
    }

    if (
      state.vehicleEngineCC &&
      isNaN(Number.parseInt(state.vehicleEngineCC))
    ) {
      newErrors.vehicleEngineCC = "Engine CC must be a valid number";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      showError("Please fill in all required fields correctly");
      return false;
    }

    // Validate document images
    const requiredDocuments = ["grant", "insurance", "evp"];
    const missingDocuments = requiredDocuments.filter(
      (doc) => !documentImages[doc]
    );

    if (missingDocuments.length > 0) {
      showError(
        `Please upload all required documents: ${missingDocuments.join(", ")}`
      );
      return false;
    }

    // Validate vehicle photos
    const requiredPhotos = [
      "front",
      "back",
      "left",
      "right",
      "interior",
      "dashboard",
    ];
    const missingPhotos = requiredPhotos.filter(
      (photo) => !documentImages[photo]
    );

    if (missingPhotos.length > 0) {
      showError(
        `Please upload all required vehicle photos: ${missingPhotos.join(", ")}`
      );
      return false;
    }

    return true;
  };

  const submitSignup = async () => {
    // Prevent multiple submissions
    if (uploading) {
      return;
    }

    // If user is car owner, validate the form
    if (isChecked && !validateCarOwnerForm()) {
      return;
    }

    try {
      setUploading(true);

      // Base data structure with userData from previous screen
      const data = {
        bankDetails: {
          accountHolderName: userData.bankDetails?.accountHolderName || "",
          accountNumber: userData.bankDetails?.accountNumber || "",
          bankName: userData.bankDetails?.bankName || "name",
        },
        driverLicenseBackUrl: userData.driverLicenseBackUrl || "",
        driverLicenseFrontUrl: userData.driverLicenseFrontUrl || "",
        driverType: userData.driverType || "",
        email: userData.email || "",
        name: userData.name || "",
        operations: userData.operations || [],
        password: userData.password || "",
        personalIdBackUrl: userData.personalIdBackUrl || "",
        personalIdFrontUrl: userData.personalIdFrontUrl || "",
        phone: userData.phone || "",
        psvLicenseBackUrl: userData.psvLicenseBackUrl || "",
        psvLicenseFrontUrl: userData.psvLicenseFrontUrl || "",
        verificationToken: userData.verificationToken || "",
        isCarOwner: isChecked,
      };

      // Only add vehicle data if user is car owner
      if (isChecked) {
        data.vehicleSpecs = {
          name: `${state.vehicleNumber} ${state.vehicleModel}`,
          category: state.vehicleType || "car",
          model: state.vehicleModel,
          manufacturingYear:
            Number.parseInt(state.vehicleRegistrationYear) || 0,
          make: state.vehicleNumber,
          registrationYear: Number.parseInt(state.vehicleRegistrationYear) || 0,
          engineCapacity: state.vehicleEngineCC,
          color: state.vehicleColor,
          plateNumber: state.vehiclePlateNumber,
          mileage: state.vehicleMileage,
        };

        data.vehicleDocuments = {
          grantCertificateUrl: documentImages.grant,
          insuranceUrl: documentImages.insurance,
          evpUrl: documentImages.evp,
        };

        data.vehiclePhotos = {
          frontUrl: documentImages.front,
          backUrl: documentImages.back,
          leftUrl: documentImages.left,
          rightUrl: documentImages.right,
          interiorUrl: documentImages.interior,
          dashboardUrl: documentImages.dashboard,
        };
      }

      console.log("Signup Request Payload:", JSON.stringify(data, null, 2));

      const response = await post("auth/register/rider", data);
      console.log(
        "Signup API Response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data.success) {
        showSuccess(
          response.data.message ||
            "Rider registered successfully. Account pending verification."
        );
        navigation.navigate("Login");
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      // Log complete error object for debugging
      console.log("Complete Error Object:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
        },
      });

      let errorMessage = "Failed to complete registration";

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        console.log("Raw errors object:", JSON.stringify(errors, null, 2));

        errorMessage = Object.entries(errors)
          .map(([field, messages]) => {
            const messageList = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${messageList.join(", ")}`;
          })
          .join("\n");

        setErrors(errors);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes("Network Error")) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      console.log("Final error message:", errorMessage);
      showError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="light-content"
        translucent={true}
      />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <CustomText
          label="Vehicle Information"
          fontSize={20}
          fontWeight="700"
          style={styles.headerTitle}
        />
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.checkboxContainer}>
            <CustomCheckbox
              value={isChecked}
              onValueChange={(value) => setIsChecked(value)}
            />
            <CustomText
              label="I am the car Owner"
              fontSize={15}
              fontWeight="500"
            />
          </View>

          {isChecked && (
            <>
              <View style={styles.dropdownContainer}>
                <Dropdown
                  items={vehicleOptions}
                  defaultValue={state.vehicleType}
                  onSelectItem={(selectedItem) => {
                    console.log("Selected Item:", selectedItem);
                    // Extract only the value if selectedItem is an object
                    const value =
                      typeof selectedItem === "object" && selectedItem.value
                        ? selectedItem.value
                        : selectedItem;
                    console.log("Extracted Value:", value);
                    updateState("vehicleType", value);
                  }}
                  placeholder="Select your Vehicle"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownList}
                />
                {errors.vehicleType && (
                  <Text style={styles.errorText}>{errors.vehicleType}</Text>
                )}
              </View>

              <CustomInput
                withLabel={"Company"}
                placeholder="Company (e.g., Toyota, Honda)"
                marginTop={10}
                value={state.vehicleNumber}
                onChangeText={(text) => updateState("vehicleNumber", text)}
                error={errors.vehicleNumber}
              />

              <CustomInput
                withLabel={"Model"}
                placeholder="Model (e.g., Vellfire, Alza)"
                marginTop={10}
                value={state.vehicleModel}
                onChangeText={(text) => updateState("vehicleModel", text)}
                error={errors.vehicleModel}
              />

              <View style={styles.row}>
                <CustomInput
                  withLabel={"Reg. Year"}
                  placeholder="Reg. Year"
                  marginTop={10}
                  value={state.vehicleRegistrationYear}
                  onChangeText={(text) =>
                    updateState("vehicleRegistrationYear", text)
                  }
                  width={150}
                  error={errors.vehicleRegistrationYear}
                  keyboardType="numeric"
                />
                <CustomInput
                  withLabel={"Engine CC"}
                  placeholder="Engine CC"
                  marginTop={10}
                  value={state.vehicleEngineCC}
                  onChangeText={(text) => updateState("vehicleEngineCC", text)}
                  width={150}
                  error={errors.vehicleEngineCC}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.row}>
                <CustomInput
                  withLabel={"Plate Number"}
                  placeholder="Plate Number"
                  marginTop={10}
                  value={state.vehiclePlateNumber}
                  onChangeText={(text) =>
                    updateState("vehiclePlateNumber", text)
                  }
                  width={150}
                  error={errors.vehiclePlateNumber}
                />
                <CustomInput
                  withLabel={"Mileage"}
                  placeholder="Mileage"
                  marginTop={10}
                  value={state.vehicleMileage}
                  onChangeText={(text) => updateState("vehicleMileage", text)}
                  width={150}
                  error={errors.vehicleMileage}
                  keyboardType="numeric"
                />
              </View>

              <CustomInput
                withLabel={"Color"}
                placeholder="Color"
                marginTop={10}
                value={state.vehicleColor}
                onChangeText={(text) => updateState("vehicleColor", text)}
                error={errors.vehicleColor}
              />

              <CustomInput
                withLabel={"Vehicle Registration Number"}
                placeholder="Vehicle Registration Number"
                marginTop={10}
                value={state.vehicleRegistrationNumber}
                onChangeText={(text) =>
                  updateState("vehicleRegistrationNumber", text)
                }
                error={errors.vehicleRegistrationNumber}
              />

              {/* card image upload */}
              <View style={styles.card}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Vehicle Documents</Text>

                  <View style={styles.photoRow}>
                    <DocumentUploadItem title="Grant (PDF)" type="grant" />
                    <DocumentUploadItem
                      title="Insurance (PDF)"
                      type="insurance"
                    />
                  </View>
                </View>
                <DocumentUploadItem title="EVP Certificate" type="evp" />

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Vehicle Photos</Text>
                  <View style={styles.photoGrid}>
                    <View style={styles.photoRow}>
                      <PhotoUploadItem title="Front" type="front" />
                      <PhotoUploadItem title="Rear" type="back" />
                    </View>
                    <View style={styles.photoRow}>
                      <PhotoUploadItem title="Left" type="left" />
                      <PhotoUploadItem title="Right" type="right" />
                    </View>
                    <View style={styles.photoRow}>
                      <PhotoUploadItem title="Interior" type="interior" />
                      <PhotoUploadItem title="Dashboard" type="dashboard" />
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}

          {/* Submit button is always shown */}
          <CustomButton
            title={uploading ? "Submitting..." : "Submit"}
            onPress={submitSignup}
            marginTop={20}
            disabled={uploading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Vehicle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    marginLeft: -40, // To center the title by offsetting the back button
  },
  headerRight: {
    width: 40, // Same as back button for balance
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#E8F6F2",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  dropdownContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 12,
  },
  photoGrid: {
    width: "100%",
  },
  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
