import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { get } from "../../../services/ApiRequest";

export default function Jobs({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("All");
  const tabs = ["All", "Active", "Completed", "Cancel"];

  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const getJobs = async () => {
    try {
      setLoading(true);
      const response = await get("bookings/rider/my-bookings");
      console.log(response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const JobCard = ({ status, color }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.pointBlock}>
          <FontAwesome6 name="location-dot" size={20} color="#1F5546" />
          <View style={{ marginLeft: 5 }}>
            <Text style={styles.pointLabel}>Pickup</Text>
            <Text style={styles.pointAddress}>123 main st</Text>
          </View>
        </View>

        <View style={styles.dottedLine} />

        <View style={styles.pointBlock}>
          <FontAwesome6 name="location-dot" size={20} color="#1F5546" />
          <View style={{ marginLeft: 5 }}>
            <Text style={styles.pointLabel}>Drop Off</Text>
            <Text style={styles.pointAddress}>123 main st</Text>
          </View>
        </View>

        <Text style={styles.infoText}>Distance: 2.5 km</Text>
        <Text style={styles.infoText}>Time: 10 min</Text>
      </View>

      <View style={styles.cardRight}>
        <Text style={styles.price}>$20</Text>
        <TouchableOpacity
          style={[styles.statusBtn, { backgroundColor: color }]}
        >
          <Text style={styles.statusBtnText}>{status}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    let cards = [];

    switch (selectedTab) {
      case "All":
        cards = [
          { status: "Completed", color: "#1F5546" },
          { status: "Active", color: "#F1C40F" },
          { status: "Cancel", color: "#E74C3C" },
        ];
        break;
      case "Active":
        cards = [{ status: "Active", color: "#F1C40F" }];
        break;
      case "Completed":
        cards = [
          { status: "Completed", color: "#1F5546" },
          { status: "Completed", color: "#1F5546" },
          { status: "Completed", color: "#1F5546" },
        ];
        break;
      case "Cancel":
        cards = [
          { status: "Cancel", color: "#E74C3C" },
          { status: "Cancel", color: "#E74C3C" },
        ];
        break;
      default:
        return <Text style={styles.tabContentText}>Unknown Tab</Text>;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.cardWrapper}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((card, index) => (
          <JobCard key={index} status={card.status} color={card.color} />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <AntDesign name="left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Jobs</Text>
        <AntDesign name="left" size={20} color="transparent" />
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>{renderTabContent()}</View>
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
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tabButton: {
    borderWidth: 1,
    borderColor: "#A7A7A7",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: "#1F5546",
  },
  tabText: {
    color: "#A7A7A7",
    fontWeight: "500",
    fontSize: 16,
  },
  tabTextActive: {
    color: "white",
  },
  contentContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  tabContentText: {
    fontSize: 16,
    color: "#26433D",
    textAlign: "center",
  },

  // Cards
  cardWrapper: {
    paddingBottom: 20,
    alignItems: "center",
    gap: 15,
  },
  card: {
    backgroundColor: "white",
    width: 344,
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLeft: {
    flex: 1,
  },
  pointBlock: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pointLabel: {
    fontSize: 10,
    color: "#999999",
  },
  pointAddress: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
  },
  dottedLine: {
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    borderStyle: "dotted",
    height: 8,
    marginLeft: 8,
    marginVertical: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#000",
    marginTop: 2,
  },
  cardRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F5546",
  },
  statusBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    height: 27,
    width: 81,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
