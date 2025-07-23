import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
import CustomCountryPick from "../../../components/CustomCountryPick";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";
import UploadImage from "../../../components/UploadImage";
import { useRoute } from "@react-navigation/native";
import { post, put } from "../../../services/ApiRequest";
import { showError, showSuccess } from "../../../utils/toast";
import Dropdown from "../../../components/Dropdown";

const EditProfile = ({ navigation }) => {
  const route = useRoute();
  const { profileData } = route.params || {};

  // Initialize form state with profile data
  const [states, setStates] = useState({
    firstName: profileData?.data?.user?.name?.split(" ")[0] || "",
    lastName: profileData?.data?.user?.name?.split(" ")[1] || "",
    age: profileData?.data?.user?.age || "",
    email: profileData?.data?.user?.email || "",
    password: "",
    phoneNumber: profileData?.data?.user?.phone || "",
    selectedCity: [], // Initialize as empty array for multiple selection
  });

  const [loading, setLoading] = useState(false);

  const updateoperations = async () => {
    const data = {
      operations: Array.isArray(states.selectedCity) 
        ? states.selectedCity.map(city => city.value || city) 
        : [states.selectedCity?.value || states.selectedCity || '']
    };
    
    console.log('Sending data:', data);
    
    try {
      setLoading(true);
      const response = await put("rider/operations", data);
      console.log("Update Operations API Response:", response.data);
      setLoading(false);
      showSuccess("Operations updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Update Operations Error:", error);
      setLoading(false);
      showError("Failed to update Operations. Please try again.");
    }
  };

  const cityOptions = [
    { label: "Kuala Lumpur", value: "kuala_lumpur" },
    { label: "Penang", value: "penang" },
    { label: "Johor Bahru", value: "johor_bahru" },
    { label: "Ipoh", value: "ipoh" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
      
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
        <UploadImage />

        <CustomText
          label="First Name"
          fontSize={15}
          marginTop={10}
          fontWeight="500"
        />
        <CustomInput
          placeholder="Name"
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
          placeholder="Number"
          marginTop={10}
          keyboardType="phone-pad"
          value={states.phoneNumber}
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, phoneNumber: text }))
          }
        />

        <CustomCountryPick />

        <CustomButton
          title={loading ? "Updating..." : "Update"}
          fontSize={16}
          fontWeight="400"
          marginTop={30}
          backgroundColor="#1F5546"
          onPress={updateoperations}
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
    height: 114,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  dropdown: {
    marginTop: 10,
  },
});