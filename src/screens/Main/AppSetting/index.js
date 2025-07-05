import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomText from "../../../components/CustomText";
import CustomToggle from "../../../components/CustomToggle";

export default function AppSetting() {
  const navigation=useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#1F5546"
        barStyle="light-content"
        translucent={false}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Account</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>
      <View style={{ padding: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <CustomText
            label="Allow Notifications"
            fontSize={14}
            fontWeight="500"
          />
          <CustomToggle />
        </View>
        {/* Second */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 40,
          }}
        >
          <View>
            <CustomText
              label="Push notifications"
              fontSize={14}
              fontWeight="500"
            />
            <CustomText
              label="Tincidunt integer fringilla orci in non sed."
              fontSize={12}
              fontWeight="400"
              color="#999999"
              marginTop={10}
            />
          </View>
          <CustomToggle />
        </View>
        {/* THird */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 40,
          }}
        >
          <View>
            <CustomText label="Text Message" fontSize={14} fontWeight="500" />
            <CustomText
              label="Tincidunt integer fringilla orci in non sed."
              fontSize={12}
              fontWeight="400"
              color="#999999"
              marginTop={10}
            />
          </View>
          <CustomToggle />
        </View>
        {/* Fourth */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 40,
          }}
        >
          <View>
            <CustomText
              label="Payment notifications"
              fontSize={14}
              fontWeight="500"
            />
            <CustomText
              label="Facilisis facilisis velit metus ipsum, vestibulum ipsum arcu, sem lectus."
              fontSize={12}
              fontWeight="400"
              color="#999999"
              marginTop={10}
              width={280}
              lineHeight={15}
            />
          </View>
          <CustomToggle />
        </View>
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
});
