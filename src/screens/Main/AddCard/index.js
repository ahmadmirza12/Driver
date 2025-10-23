import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "../../../components/CustomButton";
import CustomCheckBox from "../../../components/CustomCheckBox";
import CustomInput from "../../../components/CustomInput";
import CustomText from "../../../components/CustomText";

export default function AddCard() {
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#1F5546"
        barStyle="dark-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add New Card</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      {/* Scrollable Form */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <CustomText label="Card Holder" fontSize={15} fontWeight="400" />
          <CustomInput placeholder="Name" marginTop={10} />

          <CustomText label="Card Number" fontSize={15} fontWeight="400" />
          <CustomInput placeholder="6457 6549 8737 8654" marginTop={10} />

          <CustomText label="Expire Date" fontSize={15} fontWeight="400" />
          <CustomInput placeholder="05/25" marginTop={10} />

          <CustomText label="CVV" fontSize={15} fontWeight="400" />
          <CustomInput placeholder="361" marginTop={10} />

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <CustomCheckBox
              value={isChecked}
              onValueChange={() => setIsChecked(!isChecked)}
            />
            <Text style={styles.checkboxLabel}>
              {" "}
              Set as default payment method
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Button at Bottom */}
      <View style={styles.buttonContainer}>
        <CustomButton title="Add Card" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 114,
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
  scrollContainer: {
    paddingBottom: 20,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
