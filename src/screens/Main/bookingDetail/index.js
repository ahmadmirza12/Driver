import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton";
import { put } from "../../../services/ApiRequest";
import { useNavigation } from "expo-router";

const BookingDetail = ({ route }) => {
  const [loading, setloading] = useState(false);
  const { item } = route.params;
  const navigation = useNavigation();
  // Format date and time
  const pickupDate = new Date(item.pickupDateTime).toLocaleDateString();
  const pickupTime = new Date(item.pickupDateTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View>
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={19} color="#1F5546" />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.labelText}>Pickup</Text>
                <Text style={styles.valueText}>
                  {item.pickupLocation || "Location not specified"}
                </Text>
              </View>
            </View>
            <View style={styles.dotsLine} />
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={19} color="#1F5546" />
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.labelText}>Drop Off</Text>
                <Text style={styles.valueText}>
                  {item.dropoffLocation || "Location not specified"}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.price}>${item.estimatedPrice || "N/A"}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            <Text style={{ fontWeight: "bold" }}>Date: </Text>
            {pickupDate}
          </Text>
          <Text style={styles.metaText}>
            <Text style={{ fontWeight: "bold" }}>Time: </Text>
            {pickupTime}
          </Text>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Booking Information</Text>
          {/* <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID:</Text>
            <Text style={styles.detailValue}>{item._id}</Text>
          </View> */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service Type:</Text>
            <Text style={styles.detailValue}>{item.serviceType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle Type:</Text>
            <Text style={styles.detailValue}>{item.vehicleType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle Brand:</Text>
            <Text style={styles.detailValue}>{item.vehicleBrandName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Add-on Services:</Text>
            <Text style={styles.detailValue}>
              {item.addOnServices?.join(", ") || "None"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Flight Number:</Text>
            <Text style={styles.detailValue}>{item.flightNumber || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={styles.detailValue}>{item.status}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Passenger Count:</Text>
            <Text style={styles.detailValue}>{item.passengerCount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Status:</Text>
            <Text style={styles.detailValue}>{item.paymentStatus}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Special Instructions:</Text>
            <Text style={styles.detailValue}>
              {item.specialInstructions || "None"}
            </Text>
          </View>
        </View>
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{item.customerId.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailValue}>{item.customerId.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{item.customerId.phone}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BookingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 80,
    paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 20,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  labelText: {
    fontSize: 8,
    color: "#9C9C9C",
    fontWeight: "500",
  },
  valueText: {
    fontSize: 11,
    color: "#4D4D4D",
    marginBottom: 2,
  },
  dotsLine: {
    borderLeftWidth: 1,
    borderColor: "#D3D3D3",
    height: 8,
    marginLeft: 6,
    marginVertical: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F5546",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  metaText: {
    fontSize: 10,
    color: "#333",
  },
  detailSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#D3D3D3",
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F5546",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9C9C9C",
    width: 120,
  },
  detailValue: {
    fontSize: 12,
    color: "#4D4D4D",
    flex: 1,
  },
  horizantal: {
    paddingHorizontal: 20,
  },
});
