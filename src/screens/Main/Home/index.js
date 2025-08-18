import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { get, put } from "../../../services/ApiRequest";
import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useSelector } from "react-redux";

export default function Home() {
  const userData = useSelector((state) => state.users.userData);
  const [data, setData] = useState([]); 
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const navigation = useNavigation();

  const startride = async (booking) => {
    try {
      const response = await put(`bookings/rider/${booking._id}/start`);
      console.log("response of start", response.data);
    } catch (error) {
      console.error("Error getting start ride:", error);
    }
  };

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       let { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         setErrorMsg("Permission to access location was denied");
  //         return;
  //       }

  //       let location = await Location.getCurrentPositionAsync({
  //         accuracy: Location.Accuracy.High,
  //       });

  //       setLocation(location);
  //       setRegion({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //         latitudeDelta: 0.005,
  //         longitudeDelta: 0.005,
  //       });
  //     } catch (error) {
  //       console.error("Error getting location:", error);
  //       setErrorMsg("Error getting location");
  //     }
  //   })();
  // }, []);

  const getbooking = async () => {
    try {
      const response = await get("bookings/rider/my-bookings");
      // console.log(response.data?.data?.bookings);
      setData(response.data?.data?.bookings);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  useEffect(() => {
    getbooking();
  }, []);


  const handleaccept = async (booking) => {
    try {
      console.log("Accepting booking ID:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/accept`);
      console.log(response.data);
      getbooking();
    } catch (error) {
      console.error("Error accepting job:", error);
    }
  };

  const handleDecline = async (booking) => {
    try {
      console.log("Declining booking ID:", booking._id);
      const response = await put(`bookings/rider/${booking._id}/reject`, {
        rejectionReason: "Vehicle not available at that time",
      });
      console.log(response.data);
      getbooking();
    } catch (error) {
      console.error("Error declining job:", error);
    }
  };

  const renderRideItem = ({ item }) => {
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
        <View>
          <View style={styles.cardTop}>
            <View>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={19} color="#1F5546" />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.labelText}>Pickup</Text>
                  <Text
                    style={styles.valueText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {(item.pickupLocation?.length > 26
                      ? `${item.pickupLocation.substring(0, 26)}...`
                      : item.pickupLocation) || "Location not specified"}
                  </Text>
                </View>
              </View>
              <View style={styles.dotsLine} />
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={19} color="#1F5546" />
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.labelText}>Drop Off</Text>
                  <Text
                    style={styles.valueText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {(item.dropoffLocation?.length > 26
                      ? `${item.dropoffLocation.substring(0, 26)}...`
                      : item.dropoffLocation) || "Location not specified"}
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
          <View style={[styles.actionRow, { marginTop: 10 }]}>
            <TouchableOpacity
              style={[styles.acceptBtn]}
              onPress={() => handleaccept(item)}
            >
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.declineBtn]}
              onPress={() => handleDecline(item)}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
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
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{userData?.data?.user?.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.address}>{userData?.data?.user?.email}</Text>
              <AntDesign
                name="down"
                size={14}
                color="#fff"
                style={{ marginLeft: 5 }}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Feather name="bell" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapWrapper}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}

          userLocationPriority="high"
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
              description="This is your current location"
              pinColor="#1F5546"
            />
          )}
        </MapView>
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#A0A0A0"
            style={styles.searchInput}
          />
          <AntDesign name="search1" size={18} color="#1F5546" />
        </View>
        <TouchableOpacity style={styles.reloadBtn}>
          <AntDesign name="reload1" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardOverlay}>
        <FlatList
          data={data}
          renderItem={renderRideItem}
          keyExtractor={(item) => item._id || Math.random().toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
          ListEmptyComponent={
            <Text
              style={{ color: "#4D4D4D", textAlign: "center", marginTop: 1 }}
            >
              No ride requests available
            </Text>
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
    zIndex: 10,
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
  name: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
  },
  address: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "400",
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
  },
  searchWrapper: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    zIndex: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
    color: "#000",
  },
  reloadBtn: {
    position: "absolute",
    bottom: 180,
    right: 20,
    backgroundColor: "#1F5546",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    zIndex: 4,
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 20,
    // backgroundColor: "#E8F6F2",
    // paddingTop: 15,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // elevation: 10,
    // zIndex: 2,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
  card: {
    width: 239,
    height: 148,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    elevation: 3,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "#4D4D4D",
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
  },
  metaText: {
    fontSize: 10,
    color: "#333",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  acceptBtn: {
    backgroundColor: "#1F5546",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  declineBtn: {
    backgroundColor: "#DADADA",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  acceptText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  declineText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
});
