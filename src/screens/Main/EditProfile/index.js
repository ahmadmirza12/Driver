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
import { post } from "../../../services/ApiRequest";
import { showError, showSuccess } from "../../../utils/toast";

const EditProfile = ({ navigation }) => {
  const route = useRoute();
  const { profileData } = route.params || {};
  // console.log("=====================================>", profileData);

  // Initialize form state with profile data
  const [states, setStates] = useState({
    firstName: profileData?.data?.user?.name?.split(" ")[0] || "",
    lastName: profileData?.data?.user?.name?.split(" ")[1] || "",
    age: profileData?.data?.user?.age || "", 
    email: profileData?.data?.user?.email || "",
    password: "",
    phoneNumber: profileData?.data?.user?.phone || "",
  });


  const errors = {
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    phoneNumber: "",
  };


  const [loading,setLoading]=useState(false)

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await post("auth/update-profile", {
        name: states.firstName + " " + states.lastName,
        phone: states.phoneNumber,
      });
      console.log("Update Profile API Response:", response.data);
      setLoading(false);
      showSuccess("Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Update Profile Error:", error);
      setLoading(false);
      showError("Failed to update profile. Please try again.");
    }
  };









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
          error={errors.firstName}
        />

        <CustomText label="Surname" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Surname"
          marginTop={10}
          value={states.lastName} 
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, lastName: text }))
          }
          error={errors.lastName}
        />

        <CustomText label="Age" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Age"
          marginTop={10}
          keyboardType="numeric"
          value={states.age} 
          onChangeText={(text) => setStates((prev) => ({ ...prev, age: text }))}
          error={errors.age}
        />

        <CustomText label="Password" fontSize={15} fontWeight="500" />
        <CustomInput
          placeholder="Password"
          marginTop={10}
          secureTextEntry
          value={states.password} 
          onChangeText={(text) =>
            setStates((prev) => ({ ...prev, password: text }))
          }
          error={errors.password}
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
          error={errors.email}
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
          error={errors.phoneNumber}
        />

        <CustomCountryPick />
        <CustomButton
          title="Update"
          fontSize={16}
          fontWeight="400"
          marginTop={30}
          backgroundColor="#1F5546"
          onPress={updateProfile}
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
});