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
  const tabs = [
    "All",
    "Assigned",
    "Accepted",
    "Rejected",
    "In-Progress",
    "Completed",
  ];
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);

  const getJobs = async (status = "") => {
    try {
      setLoading(true);
      const query =
        status && status !== "All" ? `?status=${status.toLowerCase()}` : "";
      const response = await get(`bookings/rider/my-bookings${query}`);
      console.log("=====>", response.data.data.bookings);
      setJobs(response.data.data.bookings || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getJobs(selectedTab);
  }, [selectedTab]);

  const JobCard = ({ job }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "completed":
          return "#1F5546";
        case "accepted":
        case "in-progress":
          return "#F1C40F";
        case "rejected":
          return "#E74C3C";
        case "assigned":
          return "#3498DB";
        default:
          return "#A7A7A7";
      }
    };

    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.pointBlock}>
            <FontAwesome6 name="location-dot" size={20} color="#1F5546" />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.pointLabel}>Pickup</Text>
              <Text style={styles.pointAddress}>{job.pickupLocation}</Text>
            </View>
          </View>

          <View style={styles.dottedLine} />

          <View style={styles.pointBlock}>
            <FontAwesome6 name="location-dot" size={20} color="#1F5546" />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.pointLabel}>Drop Off</Text>
              <Text style={styles.pointAddress}>{job.dropoffLocation}</Text>
            </View>
          </View>

          <Text style={styles.infoText}>{job.serviceType}</Text>
          <Text style={styles.infoText}>
            Time:{" "}
            {new Date(job.pickupDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.cardRight}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "column", gap: 5 }}>
              <TouchableOpacity
                style={[
                  styles.statusBtn,
                  { backgroundColor: getStatusColor(job.status) },
                ]}
              >
                <Text style={styles.statusBtnText}>{job.status}</Text>
              </TouchableOpacity>
              <Text style={styles.price}>${job.estimatedPrice}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return <Text style={styles.tabContentText}>Loading...</Text>;
    }

    if (jobs.length === 0) {
      return <Text style={styles.tabContentText}>No jobs found</Text>;
    }

    return (
      <ScrollView
        contentContainerStyle={styles.cardWrapper}
        showsVerticalScrollIndicator={false}
      >
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        </ScrollView>
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
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    color: "white",
    fontSize: 19,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 12,
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
  cardWrapper: {
    paddingBottom: 20,
    alignItems: "center",
    gap: 15,
  },
  card: {
    backgroundColor: "white",
    width: 360,
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
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  statusBtn: {
    borderRadius: 10,
    height: 27,
    width: 75,
    alignItems: "center",
    justifyContent: "center",
  },
  statusBtnText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
});
