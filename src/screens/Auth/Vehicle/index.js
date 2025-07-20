import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableOpacity, 
    Image, 
    ActivityIndicator, 
    Alert 
  } from "react-native";
  import React, { useState } from "react";
  import CustomText from "../../../components/CustomText";
  import Dropdown from "../../../components/Dropdown";
  import CustomCheckbox from "../../../components/CustomCheckBox";
  import CustomInput from "../../../components/CustomInput";
  import UploadImageUI from "../../../components/UploadImageUI";
  import { ScrollView } from "react-native";
  import CustomButton from "../../../components/CustomButton";
  import { useNavigation } from "expo-router";
  
  const Vehicle = ({ route }) => {
    const { userData } = route.params || {};
    console.log("Received userData:", userData);

    const navigation = useNavigation();
    const vehicleOptions = [
      { label: "Select Vehicle", value: "" },
      { label: "Car", value: "car" },
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
    });
    const [isChecked, setIsChecked] = useState(false);
    const [errors, setErrors] = useState({});
  
    const updateState = (field, value) => {
      setState((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    };
  
    const [documentImages, setDocumentImages] = useState({});
    const [uploading, setUploading] = useState(false);
  
    const handleDocumentUpload = async (documentType) => {
      try {
        setUploading(true);
        const result = await new Promise((resolve) => {
          setTimeout(() => {
            const mockImageUri = `https://picsum.photos/200/300?random=${Math.random()}`;
            resolve({ cancelled: false, uri: mockImageUri });
          }, 500);
        });
  
        if (!result.cancelled) {
          setDocumentImages(prev => ({
            ...prev,
            [documentType]: result.uri
          }));
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        Alert.alert('Error', 'Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    };
  
    const DocumentUploadItem = ({ title, type }) => {
      const imageUri = documentImages[type];
      
      return (
        <TouchableOpacity 
          style={styles.documentItem}
          onPress={() => handleDocumentUpload(type)}
          disabled={uploading}
        >
          <Text style={styles.documentText}>{title}</Text>
          {imageUri ? (
            <Image 
              source={{ uri: imageUri }} 
              style={styles.documentThumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.uploadIcon}>
              {uploading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.uploadIconText}>↑</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    };
  
    const PhotoUploadItem = ({ title }) => (
      <TouchableOpacity style={styles.photoItem}>
        <Text style={styles.photoText}>{title}</Text>
      </TouchableOpacity>
    );




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
          ...(documents.psvLicense && { psvLicenseFrontUrl: documents.psvLicense }),
          ...(documents.jobPermit && { psvLicenseBackUrl: documents.jobPermit }),
          operations: [state.selectedArea],
          bankDetails: {
            bankName: bankOptions.find((bank) => bank.value === state.selectedBank)?.label || "",
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
        navigation.navigate("Vehicle", { userData: data });
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
            .map((err) => typeof err === "string" ? err : err.msg || "Validation error")
            .join("\n");
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
  
        showError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <CustomText
            label="Vehicle information"
            fontSize={26}
            fontWeight="800"
            marginTop={20}
          />
        
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
                  placeholder="Select Vehicle Type" 
                  items={vehicleOptions} 
                  onValueChange={(value) => updateState('vehicleType', value)}
                  value={state.vehicleType}
                />
              </View>
  
              <CustomInput
                placeholder="Make (e.g., Toyota, Honda)"
                marginTop={20}
                value={state.vehicleNumber}
                onChangeText={(text) => updateState('vehicleNumber', text)}
              />
  
              <CustomInput
                placeholder="Model (e.g., Vellfire, Alza)"
                marginTop={20}
                value={state.vehicleModel}
                onChangeText={(text) => updateState('vehicleModel', text)}
              />
  
              <View style={styles.row}>
                <CustomInput
                  placeholder="Reg. Year"
                  marginTop={20}
                  value={state.vehicleRegistrationYear}
                  onChangeText={(text) => updateState('vehicleRegistrationYear', text)}
                  width={180}
                />
                <CustomInput
                  placeholder="Engine CC"
                  marginTop={20}
                  value={state.vehicleEngineCC}
                  onChangeText={(text) => updateState('vehicleEngineCC', text)}
                  width={180}
                />
              </View>
  
              <View style={styles.row}>
                <CustomInput
                  placeholder="Plate Number"
                  marginTop={20}
                  value={state.vehiclePlateNumber}
                  onChangeText={(text) => updateState('vehiclePlateNumber', text)}
                  width={180}
                />
                <CustomInput
                  placeholder="Mileage"
                  marginTop={20}
                  value={state.vehicleMileage}
                  onChangeText={(text) => updateState('vehicleMileage', text)}
                  width={180}
                />
              </View>
  
              <CustomInput
                placeholder="Color"
                marginTop={20}
                value={state.vehicleColor}
                onChangeText={(text) => updateState('vehicleColor', text)}
              />
  
              <CustomInput
                placeholder="Vehicle Registration Number"
                marginTop={20}
                value={state.vehicleRegistrationNumber}
                onChangeText={(text) => updateState('vehicleRegistrationNumber', text)}
              />
  
              {/* <CustomText
                label="Vehicle Document"
                fontSize={17}
                fontWeight="800"
              />
  
              <UploadImageUI
                placeholder="Upload Vehicle Document"
                marginTop={20}
                value={state.vehicleDocument}
                onChangeText={(text) => updateState('vehicleDocument', text)}
              /> */}
  
              <View style={styles.card}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Vehicle Documents</Text>
                  
                  <DocumentUploadItem title="Grant (PDF)" type="grant" />
                  <DocumentUploadItem title="Insurance (PDF)" type="insurance" />
                  <DocumentUploadItem title="EVP Certificate" type="evp" />
                </View>
  
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Vehicle Photos</Text>
                  
                  <View style={styles.photoGrid}>
                    <View style={styles.photoRow}>
                      <PhotoUploadItem title="Front" />
                      <PhotoUploadItem title="Rear" />
                      <PhotoUploadItem title="Left" />
                    </View>
                    <View style={styles.photoRow}>
                      <PhotoUploadItem title="Right" />
                      <PhotoUploadItem title="Interior" />
                      <PhotoUploadItem title="Dashboard" />
                    </View>
                  </View>
                </View>
              </View>
  
              <CustomButton
                title="Submit"
                onPress={() => navigation.navigate('AllDone')}
                marginTop={20}
              />
            </>
          )}
        </View>
      </ScrollView>
    );
  };
  
  export default Vehicle;
  
  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: '#E8F6F2',
    },
    contentContainer: {
      paddingBottom: 40,
    },
    container: {
      flex: 1,
      padding: 20,
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
      padding: 20,
      marginTop: 30,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    section: {
      marginBottom: 25,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#333",
      marginBottom: 15,
    },
    documentItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#F8F9FA",
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#E9ECEF",
    },
    documentText: {
      fontSize: 16,
      color: "#495057",
      fontWeight: "500",
      flex: 1,
      marginRight: 10,
    },
    documentThumbnail: {
      width: 40,
      height: 40,
      borderRadius: 4,
    },
    uploadIcon: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#6C757D",
      justifyContent: "center",
      alignItems: "center",
    },
    uploadIconText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "bold",
    },
    photoGrid: {
      gap: 10,
    },
    photoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    photoItem: {
      flex: 1,
      backgroundColor: "#F8F9FA",
      borderRadius: 8,
      padding: 20,
      marginHorizontal: 5,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#E9ECEF",
      minHeight: 60,
    },
    photoText: {
      fontSize: 14,
      color: "#6C757D",
      fontWeight: "500",
      textAlign: "center",
    },
  });