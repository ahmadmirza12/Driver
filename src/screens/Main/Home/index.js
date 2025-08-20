import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";
import * as Location from "expo-location";
import { get, put } from "../../../services/ApiRequest";

// Default map coordinates (San Francisco as fallback)
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
  const [bookingStatuses, setBookingStatuses] = useState({});
  const [mapRegion, setMapRegion] = useState(DEFAULT_REGION);
  const navigation = useNavigation();

  // Fetch bookings from the API
  const fetchBookings = async () => {
    try {
      const response = await get("bookings/rider/my-bookings");
      const bookingData = response.data?.data?.bookings || [];
      setBookings(bookingData);

      // Initialize booking statuses
      const statuses = bookingData.reduce((acc, booking) => {
        acc[booking._id] = booking.status || "pending";
        return acc;
      }, {});
      setBookingStatuses(statuses);

      // Set map to the first booking's pickup location if available
      if (bookingData.length > 0) {
        setMapRegion({
          latitude: bookingData[0].pickupLatitude,
          longitude: bookingData[0].pickupLongitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  // Start a ride and update the map to focus on the pickup location
  const startRide = async (booking) => {
    try {
      const response = await put(`bookings/rider/${booking._id}/start`);
      console.log("Ride started:", response.data);
      setBookingStatuses((prev) => ({
        ...prev,
        [booking._id]: "started",
      }));
      setMapRegion({
        latitude: response.data.data.booking.pickupLatitude,
        longitude: response.data.data.booking.pickupLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error starting ride:", error);
    }
  };

  // Complete a ride and refresh the bookings list
  const completeRide = async (booking) => {
    try {
      const response = await put(`bookings/rider/${booking._id}/complete`);
      console.log("Ride completed:", response.data);
      setBookingStatuses((prev) => ({
        ...prev,
        [booking._id]: "completed",
      }));
      await fetchBookings();
    } catch (error) {
      console.error("Error completing ride:", error);
    }
  };

  // Accept a booking and immediately start the ride
  const acceptBooking = async (booking) => {
    try {
      console.log("Accepting booking:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/accept`);
      console.log("Booking accepted:", response.data);
      setBookingStatuses((prev) => ({
        ...prev,
        [booking._id]: "accepted",
      }));
      await startRide(booking);
      await fetchBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
    }
  };

  // Decline a booking with a reason
  const declineBooking = async (booking) => {
    try {
      console.log("Declining booking:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/reject`, {
        rejectionReason: "Vehicle not available",
      });
      console.log("Booking declined:", response.data);
      setBookingStatuses((prev) => ({
        ...prev,
        [booking._id]: "declined",
      }));
      await fetchBookings();
    } catch (error) {
      console.error("Error declining booking:", error);
    }
  };

  // Set up location tracking for real-time updates
  const setupLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Location permission denied");
        return;
      }

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setCurrentLocation(initialLocation);

      // Subscribe to location updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // Update every 10 meters
          timeInterval: 1000, // Update every second
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

      // Cleanup subscription on component unmount
      return () => subscription.remove();
    } catch (error) {
      console.error("Error setting up location tracking:", error);
      setLocationError("Unable to access location");
    }
  };

  // Initialize bookings and location tracking on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Render each booking as a card
  const renderBookingCard = ({ item }) => {
    const pickupDate = new Date(item.pickupDateTime).toLocaleDateString();
    const pickupTime = new Date(item.pickupDateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
                    {item.pickupLocation?.slice(0, 26) || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.dotsLine} />
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={19} color="#1F5546" />
                <View>
                  <Text style={styles.labelText}>Dropoff</Text>
                  <Text style={styles.valueText} numberOfLines={1}>
                    {item.dropoffLocation?.slice(0, 26) || "N/A"}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.price}>${item.estimatedPrice || "N/A"}</Text>
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
          <View style={styles.actionRow}>
            {bookingStatuses[item._id] === "completed" ? (
              <TouchableOpacity
                style={[styles.button, styles.completedButton]}
                disabled
              >
                <Text style={styles.buttonText}>Ride Completed</Text>
              </TouchableOpacity>
            ) : bookingStatuses[item._id] === "started" ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => completeRide(item)}
              >
                <Text style={styles.buttonText}>Complete Ride</Text>
              </TouchableOpacity>
            ) : bookingStatuses[item._id] === "accepted" ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => startRide(item)}
              >
                <Text style={styles.buttonText}>Start Ride</Text>
              </TouchableOpacity>
            ) : bookingStatuses[item._id] === "declined" ? (
              <TouchableOpacity
                style={[styles.button, styles.declinedButton]}
                disabled
              >
                <Text style={[styles.buttonText, styles.declinedText]}>
                  Declined
                </Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => acceptBooking(item)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={() => declineBooking(item)}
                >
                  <Text style={[styles.buttonText, styles.declineText]}>
                    Decline
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection}>
          <Image
            source={require("../../../assets/images/Roger.png")}
            style={styles.avatar}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.name}>user</Text>
            <View style={styles.emailContainer}>
              <Text style={styles.email}>name</Text>
              <AntDesign name="down" size={14} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}
        >
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
          {bookings.map((booking) => (
            <Marker
              key={booking._id}
              coordinate={{
                latitude: booking.pickupLatitude,
                longitude: booking.pickupLongitude,
              }}
              title="Pickup Location"
              description={booking.pickupLocation}
              pinColor="#FF0000"
            />
          ))}
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
    paddingTop: 40,
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
  acceptButton: {
    backgroundColor: "#1F5546",
  },
  declineButton: {
    backgroundColor: "#DADADA",
  },
  completedButton: {
    backgroundColor: "#4CAF50",
  },
  declinedButton: {
    backgroundColor: "#FF0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  declineText: {
    color: "#333",
  },
  declinedText: {
    color: "#fff",
  },
  emptyText: {
    color: "#4D4D4D",
    textAlign: "center",
    fontSize: 14,
    padding: 20,
  },
});