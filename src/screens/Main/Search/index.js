import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const [jobs, setJobs] = useState([]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getJobs(selectedTab);
    setRefreshing(false);
  };

  const getJobs = async () => {
    try {
      setLoading(true);
      const response = await get(`driverbooking/driver/assignments`);
      // console.log("=====>", response.data.data.bookings);
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

  const JobCard = ({ job, navigation }) => {
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
        case "not-started":
          return "#FFBA0D";
        default:
          return "#A7A7A7";
      }
    };

    // Get the first service for display
    const firstService = job.serviceDetail?.services?.[0] || {};
    const pickupLocation = firstService.pickupLocation || {};
    const dropoffLocation = firstService.dropoffLocation || {};
    
    // Format date and time
    const formatDateTime = (dateStr, timeStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      if (timeStr) {
        const [hours, minutes] = timeStr.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));
      }
      return date.toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("BookingDetail", { item: job })}
      >
        <View style={styles.cardLeft}>
        
          <View style={styles.pointBlock}>
            <FontAwesome6 name="location-dot" size={20} color="#1F5546" />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.pointLabel}>Pickup</Text>
              <Text style={styles.pointAddress}>{pickupLocation.address || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.dottedLine} />

          <View style={styles.pointBlock}>
            <FontAwesome6 name="location-dot" size={20} color="#1F5546" />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.pointLabel}>Drop Off</Text>
              <Text style={styles.pointAddress}>{dropoffLocation.address || 'N/A'}</Text>
            </View>
          </View>

          <Text style={styles.infoText}>
            Time: {formatDateTime(firstService.startDate, firstService.pickupTime)}
          </Text>
          {firstService.durationHours && (
            <Text style={styles.infoText}>
              Duration: {firstService.durationHours} hours
            </Text>
          )}
        </View>

        <Text style={styles.priceTop}>${job.serviceDetail?.estimatedPrice || 0}</Text>
        
        <View style={styles.cardRight}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.statusBtn,
                { backgroundColor: getStatusColor(job.rideStatus) },
              ]}
            >
              <Text style={styles.statusBtnText}>{job.rideStatus || 'N/A'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableOpacity>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1F5546"]}
            tintColor="#1F5546"
          />
        }
      >
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} navigation={navigation} />
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
    paddingHorizontal: 10,
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
  customerInfo: {
    marginBottom: 8,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F5546",
    marginBottom: 2,
  },
  customerPhone: {
    fontSize: 12,
    color: "#666",
  },
  vehicleInfo: {
    marginBottom: 8,
  },
  vehicleText: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    fontStyle: "italic",
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
    position:"absolute",
    bottom:20,
    right:20,
    zIndex:1
  },
  price: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F5546",
  },
  priceTop: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F5546",
    position: "absolute",
    top: 16,
    right: 19,
    zIndex: 1,
  },
  statusBtn: {
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
