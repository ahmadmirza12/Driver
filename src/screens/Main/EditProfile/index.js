import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import UploadImageUI from "../../../components/UploadImageUI";
import { useSelector } from "react-redux";
import { put } from "../../../services/ApiRequest";
import { showError, showSuccess } from "../../../utils/toast";
import Dropdown from "../../../components/Dropdown";

const EditProfile = ({ navigation }) => {
  // Get user data from Redux store
  const userData = useSelector((state) => state.users.userData);

  // Initialize form state with profile data
  const [states, setStates] = useState({
    firstName: userData?.data?.user?.name?.split(" ")[0] || "",
    lastName: userData?.data?.user?.name?.split(" ")[1] || "",
    age: userData?.data?.user?.age || "",
    email: userData?.data?.user?.email || "",
    password: "",
    phoneNumber: userData?.data?.user?.phone || "",
    selectedCity: [], // Initialize as empty array for multiple selection
    selectedBank: "",
    accountNumber: "",
  });

  const [documents, setDocuments] = useState({
    icFront: null,
    icBack: null,
    licenseFront: null,
    licenseBack: null,
    psvLicense: null,
    jobPermit: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle document uploads
  const handleDocumentUpload = (type) => (url) => {
    console.log(`${type} uploaded:`, url);
    setDocuments((prev) => ({
      ...prev,
      [type]: url,
    }));
  };

  // Consolidated update function to call all APIs
  const handleUpdate = async () => {
    setLoading(true);

    try {
      // Update operations
      const operationsData = {
        operations: states.selectedCity.map((city) => city.value || city),
      };
      await put("rider/operations", operationsData);
      console.log("Operations updated successfully");

      // Update bank details
      const bankDetails = {
        bankName:
          bankOptions.find((bank) => bank.value === states.selectedBank)
            ?.label || "",
        accountNumber: states.accountNumber,
        accountHolderName: `${states.firstName} ${states.lastName}`.trim(),
      };
      await put("rider/bank-details", bankDetails);
      console.log("Bank details updated successfully");

      // Update documents
      const documentDetails = {
        personalIdFrontUrl: documents.icFront,
        personalIdBackUrl: documents.icBack,
        driverLicenseFrontUrl: documents.licenseFront,
        driverLicenseBackUrl: documents.licenseBack,
        ...(documents.psvLicense && {
          psvLicenseFrontUrl: documents.psvLicense,
        }),
        ...(documents.jobPermit && { psvLicenseBackUrl: documents.jobPermit }),
      };
      await put("rider/documents", documentDetails);
      console.log("Documents updated successfully");

      setLoading(false);
      showSuccess("Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Update Error:", error);
      setLoading(false);
      showError("Failed to update profile. Please try again.");
    }
  };

  const cityOptions = [
    { label: "Kuala Lumpur", value: "kuala_lumpur" },
    { label: "Penang", value: "penang" },
    { label: "Johor Bahru", value: "johor_bahru" },
    { label: "Ipoh", value: "ipoh" },
  ];

  const bankOptions = [
    { label: "Select Bank", value: "" },
    { label: "Maybank", value: "maybank" },
    { label: "CIMB Bank", value: "cimb" },
    { label: "Public Bank", value: "public_bank" },
    { label: "RHB Bank", value: "rhb" },
    { label: "Hong Leong Bank", value: "hong_leong" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      {/* Scrollable Form Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomText
          label="First Name"
          fontSize={15}
          marginTop={10}
          fontWeight="500"
        />
        <CustomInput
          placeholder="First Name"
          marginTop={10}
          value={states.firstName}
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, firstName: text }))
          }
        />

        <CustomText label="Surname" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Surname"
          marginTop={10}
          value={states.lastName}
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, lastName: text }))
          }
        />

        <CustomText label="Operations" fontSize={15} fontWeight="500" />
        <Dropdown
          items={cityOptions}
          multiple={true}
          defaultValue={states.selectedCity}
          onSelectItem={(selectedItems) => {
            console.log("Selected operations:", selectedItems);
            setStates((prev) => ({ ...prev, selectedCity: selectedItems }));
          }}
          placeholder="Select your operations"
          style={styles.dropdown}
          dropDownContainerStyle={{
            position: "absolute",
            width: "100%",
            zIndex: 1000,
          }}
        />

        <CustomText label="Email Address" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Your Email Address"
          marginTop={10}
          keyboardType="email-address"
          value={states.email}
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, email: text }))
          }
        />

        <CustomText label="Phone Number" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Phone Number"
          marginTop={10}
          keyboardType="phone-pad"
          value={states.phoneNumber}
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, phoneNumber: text }))
          }
        />

        {/* Bank Details */}
        <View >
          <Text style={styles.sectionTitle}>Bank Details</Text>
          <View style={styles.dropdownContainer}>
            <Dropdown
              items={bankOptions}
              defaultValue={states.selectedBank}
              onSelectItem={(selectedItem) => {
                const value =
                  typeof selectedItem === "object" && selectedItem.value
                    ? selectedItem.value
                    : selectedItem;
                setStates((prev) => ({ ...prev, selectedBank: value }));
              }}
              placeholder="Select Bank"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
            />
          </View>

          <TextInput
            style={styles.textInput}
            placeholder="Account Number"
            value={states.accountNumber}
            onChangeText={(text) =>
              setStates((prev) => ({ ...prev, accountNumber: text }))
            }
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Documents */}
        <Text style={styles.documentsTitle}>Upload Documents</Text>

        <View style={styles.documentSection}>
          <Text style={styles.documentTitle}>ID (Front & Back)</Text>
          <View style={styles.uploadGrid}>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Front</Text>
              <UploadImageUI
                label="ID Front (Required)"
                onUploadComplete={handleDocumentUpload("icFront")}
                initialImage={documents.icFront}
              />
            </View>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Back</Text>
              <UploadImageUI
                label="ID Back (Required)"
                onUploadComplete={handleDocumentUpload("icBack")}
                initialImage={documents.icBack}
              />
            </View>
          </View>
        </View>

        <View style={styles.documentSection}>
          <Text style={styles.documentTitle}>
            Driving License (Front & Back)
          </Text>
          <View style={styles.uploadGrid}>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Front</Text>
              <UploadImageUI
                label="License Front (Required)"
                onUploadComplete={handleDocumentUpload("licenseFront")}
                initialImage={documents.licenseFront}
              />
            </View>
            <View style={styles.uploadItem}>
              <Text style={styles.uploadLabel}>Back</Text>
              <UploadImageUI
                label="License Back (Required)"
                onUploadComplete={handleDocumentUpload("licenseBack")}
                initialImage={documents.licenseBack}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.documentButton}>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("psvLicense")}
              label="PSV License Front"
              compact={true}
              initialImage={documents.psvLicense}
            />
          </View>

          <View style={styles.documentButton}>
            <UploadImageUI
              onUploadComplete={handleDocumentUpload("jobPermit")}
              label="PSV License Back"
              compact={true}
              initialImage={documents.jobPermit}
            />
          </View>
        </View>

        <CustomButton
          title={loading ? "Updating..." : "Update"}
          fontSize={16}
          fontWeight="400"
          marginTop={30}
          backgroundColor="#1F5546"
          onPress={handleUpdate}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  dropdown: {
    marginTop: 10,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownList: {
    position: "absolute",
    width: "100%",
    zIndex: 1000,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  documentsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 24,
    marginTop:20
  },
  section: {
    flexDirection:"row",
    justifyContent:"space-between",
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
 
  documentButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
});
