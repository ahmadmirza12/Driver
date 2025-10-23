import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";

const BookingDetail = ({ route }) => {
  const [loading, setLoading] = useState(false);
  const { item } = route.params;
  console.log(item);
  const navigation = useNavigation();

  const service = item.bookingId?.services?.[item.serviceIndex ?? 0] ?? item.serviceDetails;
  const pickupDate = service?.startDate
    ? new Date(service.startDate).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
  const pickupTime = service?.startDate
    ? new Date(service.startDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not specified";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'cancelled':
        return '#EF4444';
      case 'completed':
        return '#1F5546';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'information-circle';
    }
  };

  const totalAmount = item.pricing?.driverPayment || 0;
  const additionalAmount = item.totalAdditionalAmount || 0;
  const baseAmount = totalAmount - additionalAmount;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Ionicons 
              name={getStatusIcon(item.rideStatus)} 
              size={24} 
              color={getStatusColor(item.rideStatus)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.rideStatus) }]}>
              {item.rideStatus || "Unknown"}
            </Text>
          </View>
        </View>

        {/* Route Card */}
        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>Trip Route</Text>
            <Text style={styles.price}>${item.pricing?.driverPayment ?? "N/A"}</Text>
          </View>
          
          <View style={styles.routeContainer}>
            <View style={styles.routeLeft}>
              <View style={styles.locationPoint} />
              <View style={styles.routeLine} />
              <View style={[styles.locationPoint, styles.destinationPoint]} />
            </View>
            
            <View style={styles.routeDetails}>
              <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>PICKUP LOCATION</Text>
                <Text style={styles.locationText}>
                  {service?.pickupLocation?.address || "Location not specified"}
                </Text>
              </View>
              
              <View style={styles.locationContainer}>
                <Text style={styles.locationLabel}>DROP OFF LOCATION</Text>
                <Text style={styles.locationText}>
                  {service?.dropoffLocation?.address || "Location not specified"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tripMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#1F5546" />
              <Text style={styles.metaLabel}>Date</Text>
              <Text style={styles.metaValue}>{pickupDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#1F5546" />
              <Text style={styles.metaLabel}>Time</Text>
              <Text style={styles.metaValue}>{pickupTime}</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="car-outline" size={20} color="#1F5546" />
            <Text style={styles.cardTitle}>Vehicle Information</Text>
          </View>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>
              {`${item.vehicleId?.specs?.make} ${item.vehicleId?.specs?.model}` || "N/A"}
            </Text>
            <Text style={styles.plateNumber}>{item.vehicleId?.specs?.plateNumber || "N/A"}</Text>
          </View>
          <Text style={styles.vehicleType}>{item.vehicleDetails?.category || item.vehicleId?.specs?.category || "Standard"}</Text>
        </View>

        {/* Trip Details Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#1F5546" />
            <Text style={styles.cardTitle}>Trip Details</Text>
          </View>
          <View style={styles.detailsGrid}>
            <DetailItem 
              label="Service Type" 
              value={service?.serviceType || "N/A"} 
              icon="car-sport-outline"
            />
            <DetailItem 
              label="Distance" 
              value={service?.estimatedDistance ? `${service.estimatedDistance} km` : "N/A"} 
              icon="speedometer-outline"
            />
            <DetailItem 
              label="Duration" 
              value={service?.durationHours ? `${service.durationHours} hours` : "N/A"} 
              icon="timer-outline"
            />
            <DetailItem 
              label="Flight Number" 
              value={service?.flightNumber || "N/A"} 
              icon="airplane-outline"
            />
          </View>
          
          {service?.additionalServices && service.additionalServices.length > 0 && (
            <View style={styles.addonsSection}>
              <Text style={styles.addonsTitle}>Add-on Services</Text>
              <View style={styles.addonsContainer}>
                {service.additionalServices.map((addon, index) => (
                  <View key={index} style={styles.addonTag}>
                    <Text style={styles.addonText}>{addon}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Customer Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-outline" size={20} color="#1F5546" />
            <Text style={styles.cardTitle}>Customer Information</Text>
          </View>
          <View style={styles.customerInfo}>
            <DetailItem 
              label="Name" 
              value={item.customerDetails?.name || "N/A"} 
              icon="person"
            />
            <DetailItem 
              label="Phone" 
              value={item.customerDetails?.phone || "N/A"} 
              icon="call"
            />
            <DetailItem 
              label="Address" 
              value={item.customerDetails?.address || "N/A"} 
              icon="location"
            />
          </View>
          
          {item.customerDetails?.specialRequirements && (
            <View style={styles.specialReqs}>
              <Text style={styles.specialReqsTitle}>Special Requirements</Text>
              <Text style={styles.specialReqsText}>
                {item.customerDetails.specialRequirements}
              </Text>
            </View>
          )}
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="card-outline" size={20} color="#1F5546" />
            <Text style={styles.cardTitle}>Pricing Details</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Base Price</Text>
            <Text style={styles.pricingValue}>${baseAmount}</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Additional Charges</Text>
            <Text style={styles.pricingValue}>${additionalAmount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${totalAmount}</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const DetailItem = ({ label, value, icon }) => (
  <View style={styles.detailItem}>
    <View style={styles.detailHeader}>
      <Ionicons name={icon} size={14} color="#6B7280" />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default BookingDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FFFE",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 100,
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F5546",
  },
  routeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  routeLeft: {
    alignItems: "center",
    marginRight: 16,
    paddingTop: 8,
  },
  locationPoint: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#1F5546",
    borderWidth: 3,
    borderColor: "#E5F3F0",
  },
  destinationPoint: {
    backgroundColor: "#EF4444",
    borderColor: "#FEE2E2",
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: "#D1D5DB",
    marginVertical: 8,
  },
  routeDetails: {
    flex: 1,
  },
  locationContainer: {
    marginBottom: 20,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 1,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
  tripMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
  },
  metaItem: {
    alignItems: "center",
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  metaValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  vehicleInfo: {
    marginBottom: 8,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  plateNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F5546",
    backgroundColor: "#E5F3F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  vehicleType: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    marginBottom: 12,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
  addonsSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  addonsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  addonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addonTag: {
    backgroundColor: "#E5F3F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addonText: {
    fontSize: 12,
    color: "#1F5546",
    fontWeight: "500",
  },
  customerInfo: {
    gap: 16,
  },
  specialReqs: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  specialReqsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  specialReqsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  pricingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#1F5546",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#E5F3F0",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  pricingLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  pricingValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F5546",
  },
  bottomSpacing: {
    height: 20,
  },
});