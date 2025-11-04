import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Platform,
  Linking,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setBookingStatus,
  setMultipleBookingStatuses,
  selectBookingStatuses,
} from "../../../store/reducer/bookingSlice";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { ActivityIndicator } from "react-native";
import { get, patch, post } from "../../../services/ApiRequest";

const DEFAULT_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const [bookings, setBookings] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [stopLocation, setStopLocation] = useState("");
  const [stopDescription, setStopDescription] = useState("");
  const [additionalAmount, setAdditionalAmount] = useState("0");
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bookingStatuses = useSelector(selectBookingStatuses);
  const user = useSelector((state) => state.data.user);

  const openMapForBooking = async (booking, status) => {
    const service = booking.bookingId?.services?.[booking.serviceIndex ?? 0] ?? booking.serviceDetails;
    const pickup = service?.pickupLocation;
    const dropoff = service?.dropoffLocation;
    const target = status === "started" ? dropoff : pickup;
    if (!target?.latitude || !target?.longitude) {
      console.log("No target location available");
      return;
    }
    const { latitude: lat, longitude: lng } = target;
    let url = "";
    if (Platform.OS === "ios") {
      url = `maps://maps.apple.com/maps?saddr,!&daddr=${lat},${lng}&dirflg=d`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${lat},${lng}&travelmode=driving`;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Cannot open map app");
      }
    } catch (error) {
      console.error("Error opening maps:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await get("driverbooking/driver/assignments");
      const bookingData = response.data?.data?.bookings || [];
      setBookings(bookingData);

      const statuses = bookingData.reduce((acc, booking) => {
        acc[booking._id] = booking.rideStatus || "not-started";
        return acc;
      }, {});
      dispatch(setMultipleBookingStatuses(statuses));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRide = async (booking, vehicleId) => {
    const bookingId = booking.bookingId._id;
    const assignmentId = booking._id;
    console.log("Extracted IDs:", { bookingId, assignmentId, vehicleId });
    try {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: "starting" }));
      const response = await patch(
        `driverbooking/${bookingId}/assignments/${assignmentId}/vehicles/${vehicleId}/ride-status`,
        { rideStatus: "started" }
      );
      console.log("Ride started request:", {
        bookingId,
        assignmentId,
        vehicleId,
      });
      console.log("Ride started response:", response.data);
      dispatch(setBookingStatus({ bookingId: booking._id, status: "started" }));
      await fetchBookings();
    } catch (error) {
      console.error("Error starting ride:", error.response?.data?.message || error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: null }));
    }
  };

  const completeRide = async (booking, vehicleId) => {
    const bookingId = booking.bookingId._id;
    const assignmentId = booking._id;
    console.log("Extracted IDs:", { bookingId, assignmentId, vehicleId });
    try {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: "completing" }));
      const response = await patch(
        `driverbooking/${bookingId}/assignments/${assignmentId}/vehicles/${vehicleId}/ride-status`,
        { rideStatus: "completed" }
      );
      console.log("Ride completed:", response.data);
      dispatch(setBookingStatus({ bookingId: booking._id, status: "completed" }));
      await fetchBookings();
    } catch (error) {
      console.error("Error completing ride:", error.response?.data?.message || error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: null }));
    }
  };

  const addStop = async () => {
    const bookingId = selectedBooking.bookingId._id;
    const assignmentId = selectedBooking._id;
    console.log("Extracted IDs for add stop:", { bookingId, assignmentId, vehicleId: selectedVehicleId });
    try {
      setLoadingStates((prev) => ({ ...prev, [selectedBooking._id]: "addingStop" }));
      const response = await post(
        `driverbooking/${bookingId}/assignments/${assignmentId}/vehicles/${selectedVehicleId}/stops`,
        {
          location: stopLocation,
          description: stopDescription,
          additionalAmount: parseFloat(additionalAmount) || 0,
        }
        
      );

      console.log("Stop added:", response.data);
      setModalVisible(false);
      setStopLocation("");
      setStopDescription("");
      setAdditionalAmount("0");
      await fetchBookings();
    } catch (error) {
      console.error("Error adding stop:", error.response?.data?.message || error.message);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [selectedBooking._id]: null }));
    }
  };

  const openStopModal = (booking, vehicleId) => {
    setSelectedBooking(booking);
    setSelectedVehicleId(vehicleId);
    setModalVisible(true);
  };

  const setupLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(initialLocation);

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 1000,
        },
        (newLocation) => {
          setCurrentLocation(newLocation);
          setMapRegion((prev) => ({
            ...prev,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          }));
        }
      );

      return () => subscription.remove();
    } catch (error) {
      console.error("Error setting up location tracking:", error);
      setLocationError("Unable to access location");
    }
  };

  useEffect(() => {
    fetchBookings();
    setupLocationTracking();
  }, []);

  const renderBookingCard = ({ item }) => {
    const service = item.bookingId?.services?.[item.serviceIndex ?? 0] ?? item.serviceDetails;
    const pickupDate = service?.startDate ? new Date(service.startDate).toLocaleDateString() : "N/A";
    const pickupTime = service?.pickupTime || "N/A";
    const vehicle = item.vehicleId;
    const status = bookingStatuses[item._id] || item.rideStatus;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("BookingDetail", { item })}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <View style={styles.locationContainer}>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={19} color="#1F5546" />
                <View>
                  <Text style={styles.labelText}>Pickup</Text>
                  <Text style={styles.valueText} numberOfLines={1}>
                    {service.pickupLocation?.address?.slice(0, 20) || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.dotsLine} />
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={19} color="#1F5546" />
                <View>
                  <Text style={styles.labelText}>Dropoff</Text>
                  <Text style={styles.valueText} numberOfLines={1}>
                    {service.dropoffLocation?.address?.slice(0, 20) || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.pricing?.driverPayment ?? "N/A"}</Text>
              {status !== "completed" && (
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => openMapForBooking(item, status)}
                >
                  <MaterialIcons name="directions" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Date: </Text>
              {pickupDate}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Time: </Text>
              {pickupTime}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Customer: </Text>
              {item.customerDetails.name}
            </Text>
            <Text style={styles.metaText}>
              <Text style={styles.bold}>Vehicle: </Text>
              {`${vehicle.specs.make} ${vehicle.specs.model}`}
            </Text>
          </View>
          <View style={styles.actionRow}>
            {status === "not-started" && (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={() => startRide(item, vehicle._id)}
                disabled={loadingStates[item._id] === "starting"}
              >
                {loadingStates[item._id] === "starting" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Start</Text>
                )}
              </TouchableOpacity>
            )}
            {status === "started" && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.stopButton]}
                  onPress={() => openStopModal(item, vehicle._id)}
                  disabled={loadingStates[item._id] === "addingStop"}
                >
                  {loadingStates[item._id] === "addingStop" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Stop At</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.completeButton]}
                  onPress={() => completeRide(item, vehicle._id)}
                  disabled={loadingStates[item._id] === "completing"}
                >
                  {loadingStates[item._id] === "completing" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Complete</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
            {status === "completed" && (
              <TouchableOpacity
                style={[styles.button, styles.completedButton]}
                disabled
              >
                <Text style={styles.buttonText}>Completed</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection}>
          <View style={styles.profileDetails}>
            <Text style={styles.name}>{user?.name || 'Name'}</Text>
            <View style={styles.emailContainer}>
              <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
              <AntDesign name="down" size={14} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Feather name="bell" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          zoomEnabled
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="Your Location"
              description="Current rider location"
              pinColor="#1F5546"
            />
          )}
          {bookings.map((booking) => {
            const srv = booking.bookingId?.services?.[booking.serviceIndex ?? 0] ?? booking.serviceDetails;
            const pickup = srv?.pickupLocation;
            if (!pickup) return null;
            return (
              <Marker
                key={booking._id}
                coordinate={{
                  latitude: pickup.latitude,
                  longitude: pickup.longitude,
                }}
                title="Pickup Location"
                description={pickup.address || "Pickup Location"}
                pinColor="#FF0000"
              />
            );
          })}
        </MapView>
      </View>

      <View style={styles.bookingsOverlay}>
        <FlatList
          data={bookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookingsList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No ride requests available</Text>
          }
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Stop</Text>
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={stopLocation}
              onChangeText={setStopLocation}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={stopDescription}
              onChangeText={setStopDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Additional Amount"
              value={additionalAmount}
              onChangeText={setAdditionalAmount}
              keyboardType="numeric"
            />
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={addStop}
                disabled={loadingStates[selectedBooking?._id] === "addingStop"}
              >
                {loadingStates[selectedBooking?._id] === "addingStop" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F6F2",
  },
  header: {
    backgroundColor: "#1F5546",
    height: 70,
    // paddingTop: 40,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  profileDetails: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  email: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "400",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bookingsOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  bookingsList: {
    paddingHorizontal: 10,
    gap: 15,
  },
  card: {
    width: 240,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationContainer: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontSize: 10,
    color: "#9C9C9C",
    fontWeight: "500",
  },
  valueText: {
    fontSize: 12,
    color: "#4D4D4D",
    fontWeight: "500",
  },
  dotsLine: {
    borderLeftWidth: 1,
    borderColor: "#D3D3D3",
    height: 8,
    marginLeft: 8,
    marginVertical: 4,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F5546",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metaText: {
    fontSize: 10,
    color: "#333",
  },
  bold: {
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 10,
  },
  button: {
    backgroundColor: "#1F5546",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    flex: 1,
  },
  directionsButton: {
    backgroundColor: "#1F5546",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  startButton: {
    backgroundColor: "#1F5546",
  },
  stopButton: {
    backgroundColor: "#E74C3C",
  },
  completeButton: {
    backgroundColor: "#1F5546",
  },
  completedButton: {
    backgroundColor: "#1F5546",
  },
  submitButton: {
    backgroundColor: "#1F5546",
  },
  cancelButton: {
    backgroundColor: "#DADADA",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyText: {
    color: "#4D4D4D",
    textAlign: "center",
    fontSize: 14,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D3D3",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
});