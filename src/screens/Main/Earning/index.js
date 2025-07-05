import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "../../../components/CustomButton";
export default function Earning() {
    // UseState
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#1F5546"
        barStyle="light-content"
        translucent={false}
      />
      <View style={styles.header}>
        <TouchableOpacity>
        <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.EarningText}>Earning</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>
      <View style={styles.card}>
        <Text style={styles.PriceText}>$150k</Text>
        <Text style={{ color: "#B3B3B3", top: 5, fontSize: 16 }}>
          Total Earning
        </Text>
        <View>
          <CustomButton
            title="Withdraw"
            fontSize={16}
            loading={loading}
            disabled={!!error}
            width={310}
            marginTop={20}
            backgroundColor='#1F5546'
          />
        </View>
      </View>
      <View style={styles.TotalEarningView}>
        <Text style={{ fontSize: 14 }}>Total Earning</Text>
        <Text style={{ color: "gray" }}>$560</Text>
      </View>
      <View style={styles.TotalEarningView}>
        <Text style={{ fontSize: 14 }}>Monthly Income</Text>
        <Text style={{ color: "gray" }}>$120</Text>
      </View>
      <View style={styles.TotalEarningView}>
        <Text style={{ fontSize: 14 }}>Pending Payments</Text>
        <Text style={{ color: "gray" }}>$100</Text>
      </View>
      <View style={{ paddingHorizontal: 30, paddingTop: 8 }}>
        <Text style={styles.HistroyText}>Histroy</Text>
        <View style={styles.PendingCard}>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <Text style={{ fontSize: 10, fontWeight: "500" }}>
              June Earning
            </Text>
            <Text style={{ fontSize: 10, fontWeight: "500" }}>
              June 15, 2025
            </Text>
          </View>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600" }}>$1000</Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: "#FFA800",
                fontStyle: "italic",
              }}
            >
              Pending
            </Text>
          </View>
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
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  EarningText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    width: 340,
    height: 167,
    padding: 20,
    marginHorizontal: 25,
    marginVertical: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  PriceText: {
    fontSize: 28,
    color: "black",
    fontWeight: "bold",
  },
  TotalEarningView: {
    width: 315,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 20,
    marginBottom: 20,
  },
  HistroyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  PendingCard: {
    backgroundColor: "white",
    width: 336,
    height: 50,
    marginTop: 10,
    borderRadius: 5,
    padding: 10,
  },
});
