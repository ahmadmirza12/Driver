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
import { get, put } from "../../../services/ApiRequest";

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
  const [loadingStates, setLoadingStates] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const bookingStatuses = useSelector(selectBookingStatuses);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await get("bookings/rider/my-bookings");
      const bookingData = response.data?.data?.bookings || [];
      setBookings(bookingData);

      const statuses = bookingData.reduce((acc, booking) => {
        acc[booking._id] = booking.status || "pending";
        return acc;
      }, {});
      // console.log("statuses", statuses);
      dispatch(setMultipleBookingStatuses(statuses));
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRide = async (booking) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: "starting" }));
      console.log("Start ride:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/start`);
      console.log("Ride started:", response.data);
      dispatch(setBookingStatus({ bookingId: booking._id, status: "started" }));
      setMapRegion({
        latitude: response.data.data.booking.pickupLatitude,
        longitude: response.data.data.booking.pickupLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error("Error starting ride:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: null }));
    }
  };

  const completeRide = async (booking) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: "completing" }));
      const response = await put(`bookings/rider/${booking._id}/complete`);
      console.log("Ride completed:", response.data);
      dispatch(
        setBookingStatus({ bookingId: booking._id, status: "completed" })
      );
      await fetchBookings();
    } catch (error) {
      console.error("Error completing ride:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: null }));
    }
  };

  const acceptBooking = async (booking) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: "accepting" }));
      console.log("Accepting booking:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/accept`);
      console.log("Booking accepted:", response.data);
      dispatch(
        setBookingStatus({ bookingId: booking._id, status: "accepted" })
      );
      await fetchBookings();
    } catch (error) {
      console.error("Error accepting booking:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: null }));
    }
  };

  const declineBooking = async (booking) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: "declining" }));
      console.log("Declining booking:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/reject`, {
        rejectionReason: "Vehicle not available",
      });
      console.log("Booking declined:", response.data);
      dispatch(
        setBookingStatus({ bookingId: booking._id, status: "declined" })
      );
      await fetchBookings();
    } catch (error) {
      console.error("Error declining booking:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [booking._id]: null }));
    }
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


// update location but its not working 


  const updatelocationn = async (booking) => {
    try {
      console.log("location =========> booking:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/location`, {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      console.log("Location updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // useEffect(() => {
  //   updatelocationn();
  // }, []);





  const renderBookingCard = ({ item }) => {
    const pickupDate = new Date(item.pickupDateTime).toLocaleDateString();
    const pickupTime = new Date(item.pickupDateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const getButtonState = () => {
      const status = bookingStatuses[item._id];
      const isLoading = loadingStates[item._id];

      if (status === "completed") {
        return "completed";
      } else if (status === "started") {
        return "complete";
      } else if (status === "accepted") {
        return "start";
      } else if (status === "declined") {
        return "declined";
      } else {
        return "pending";
      }
    };

    const buttonState = getButtonState();

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
            {buttonState === "completed" && (
              <TouchableOpacity
                style={[styles.button, styles.completedButton]}
                disabled
              >
                <Text style={styles.buttonText}>Ride is Completed</Text>
              </TouchableOpacity>
            )}

            {buttonState === "complete" && (
              <TouchableOpacity
                style={[styles.button, styles.completeButton]}
                onPress={() => completeRide(item)}
                disabled={loadingStates[item._id] === "completing"}
              >
                {loadingStates[item._id] === "completing" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Complete</Text>
                )}
              </TouchableOpacity>
            )}

            {buttonState === "start" && (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={() => startRide(item)}
                disabled={loadingStates[item._id] === "starting"}
              >
                {loadingStates[item._id] === "starting" ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Start</Text>
                )}
              </TouchableOpacity>
            )}

            {buttonState === "declined" && (
              <TouchableOpacity
                style={[styles.button, styles.declinedButton]}
                disabled
              >
                <Text style={[styles.buttonText, styles.declinedText]}>
                  Declined
                </Text>
              </TouchableOpacity>
            )}

            {buttonState === "pending" && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => acceptBooking(item)}
                  disabled={loadingStates[item._id] === "accepting"}
                >
                  {loadingStates[item._id] === "accepting" ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Accept</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.declineButton]}
                  onPress={() => declineBooking(item)}
                  disabled={loadingStates[item._id] === "declining"}
                >
                  {loadingStates[item._id] === "declining" ? (
                    <ActivityIndicator color="#E74C3C" />
                  ) : (
                    <Text style={[styles.buttonText, styles.declineText]}>
                      Decline
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1F5546" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileSection}>
          <Image
            source={require("../../../assets/images/Roger.png")}
            style={styles.avatar}
          />
          <View style={styles.profileDetails}>
            <Text style={styles.name}>Name</Text>
            <View style={styles.emailContainer}>
              <Text style={styles.email}>user@example.com</Text>
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
  startButton: {
    backgroundColor: "#FF9500",
  },
  completeButton: {
    backgroundColor: "#007AFF",
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
