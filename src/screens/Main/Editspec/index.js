import {
    StatusBar,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Alert,
  } from "react-native";
  import React from "react";
  import { TouchableOpacity } from "react-native";
  import { AntDesign } from "@expo/vector-icons";
  import { useNavigation } from "expo-router";
  import Dropdown from "../../../components/Dropdown";
  import CustomInput from "../../../components/CustomInput";
  import { useState } from "react";
  import axios from "axios";
  import { put } from "../../../services/ApiRequest";
  import { showSuccess, showError } from "../../../utils/toast";
  import CustomText from "../../../components/CustomText";
  
  const Editspec = () => {
    const vehicleOptions = [
      { label: "Select Vehicle", value: "" },
      { label: "Car", value: "car" },
      { label: "Bike", value: "bike" },
      { label: "Truck", value: "truck" },
      { label: "Bus", value: "bus" },
    ];
  
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
  
    const updateState = (field, value) => {
      setState((prev) => ({ ...prev, [field]: value }));
    };
  
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
  
    // Success and error handlers
    
  
    const editspec = async () => {
      setLoading(true);
  
      // Extract only the value from category if it's an object
      const categoryValue =
        typeof state.vehicleType === "object" && state.vehicleType.value
          ? state.vehicleType.value
          : state.vehicleType || "car";
  
      const data = {
        vehicleSpecs: {
          name:
            `${state.vehicleNumber} ${state.vehicleModel}`.trim() || "Vehicle",
          category: categoryValue,
          model: state.vehicleModel || "",
          manufacturingYear: state.vehicleRegistrationYear || 0,
          make: state.vehicleNumber || "",
          registrationYear: state.vehicleRegistrationYear || 0,
          engineCapacity: state.vehicleEngineCC || "",
          color: state.vehicleColor || "",
          plateNumber: state.vehiclePlateNumber || "",
          mileage: state.vehicleMileage || "",
        },
      };
  
      console.log("Sending data:", JSON.stringify(data, null, 2));
  
      try {
        const response = await put("rider/vehicle/specs", data);
        console.log("API Response:", response.data);
  
        if (response.data && response.data.success) {
          showSuccess("Vehicle edited successfully");
          navigation.goBack();
        } else {
          showSuccess("Vehicle updated successfully");
          navigation.goBack();
        }
      } catch (error) {
        console.error("API Error:", error);
        if (error.response && error.response.data) {
          console.error("Error Response:", error.response.data);
  
          // Handle validation errors specifically
          if (
            error.response.data.errors &&
            Array.isArray(error.response.data.errors)
          ) {
            const errorMessages = error.response.data.errors
              .map((err) => err.msg)
              .join("\n");
            showError(`Validation Error:\n${errorMessages}`);
          } else {
            showError(
              `Failed to edit vehicle: ${
                error.response.data.message || "Server error"
              }`
            );
          }
        } else if (error.request) {
          showError("Network error. Please check your connection.");
        } else {
          showError("Failed to edit vehicle");
        }
      } finally {
        setLoading(false);
      }
    };
  
    const handleYearInput = (text) => {
      const numericText = text.replace(/[^0-9]/g, "").slice(0, 4);
      updateState("vehicleRegistrationYear", numericText);
    };
  
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent={true}
        />
  
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="left" size={20} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Vehicle</Text>
          <View style={{ width: 20 }} />
        </View>
  
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Vehicle Specifications</Text>
  
            <CustomText label="Vehicle Type" />
            <View style={styles.dropdownContainer}>
              <Dropdown
                items={vehicleOptions}
                defaultValue={state.vehicleType}
                onSelectItem={(selectedItem) => {
                  console.log("Selected Item:", selectedItem);
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
            </View>
  
            <CustomText label="Vehicle Make" />
            <CustomInput
              placeholder="Make (e.g., Toyota, Honda)"
              marginTop={5}
              value={state.vehicleNumber}
              onChangeText={(text) => updateState("vehicleNumber", text)}
            />
  
            <CustomText label="Vehicle Model" />
            <CustomInput
              placeholder="Model (e.g., Vellfire, Alza)"
              marginTop={5}
              value={state.vehicleModel}
              onChangeText={(text) => updateState("vehicleModel", text)}
            />
  
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <CustomText label="Manufacturing Year" />
                <CustomInput
                  placeholder={`Year (1990-${new Date().getFullYear()})`}
                  marginTop={5}
                  value={state.vehicleRegistrationYear}
                  onChangeText={handleYearInput}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <View style={styles.halfInput}>
                <CustomText label="Engine Capacity" />
                <CustomInput
                  placeholder="Engine CC"
                  marginTop={5}
                  value={state.vehicleEngineCC}
                  onChangeText={(text) => updateState("vehicleEngineCC", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
  
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <CustomText label="Plate Number" />
                <CustomInput
                  placeholder="Plate Number"
                  marginTop={5}
                  value={state.vehiclePlateNumber}
                  onChangeText={(text) => updateState("vehiclePlateNumber", text)}
                />
              </View>
              <View style={styles.halfInput}>
                <CustomText label="Mileage" />
                <CustomInput
                  placeholder="Mileage"
                  marginTop={5}
                  value={state.vehicleMileage}
                  onChangeText={(text) => updateState("vehicleMileage", text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
  
            <CustomText label="Vehicle Color" />
            <CustomInput
              placeholder="Color"
              marginTop={5}
              value={state.vehicleColor}
              onChangeText={(text) => updateState("vehicleColor", text)}
            />
  
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={editspec}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Updating..." : "Update Vehicle"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default Editspec;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E8F6F2",
    },
    header: {
      backgroundColor: "#1F5546",
      height: 100,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingTop: 50,
      paddingHorizontal: 20,
    },
    headerText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 30,
    },
    formContainer: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: "#1F5546",
      marginBottom: 20,
    },
    dropdownContainer: {
      marginBottom: 20,
      zIndex: 1000,
    },
    dropdown: {
      backgroundColor: "white",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    dropdownList: {
      position: "absolute",
      width: "100%",
      zIndex: 1000,
      backgroundColor: "white",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#E0E0E0",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 20,
    },
    halfInput: {
      flex: 0.48,
    },
    submitButton: {
      backgroundColor: "#1F5546",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 30,
    },
    submitButtonDisabled: {
      backgroundColor: "#A0A0A0",
    },
    submitButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });