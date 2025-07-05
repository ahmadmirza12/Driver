import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

const GetLocation = () => {
  const [locationData, setLocationData] = useState({});

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showPermissionAlert();
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      setLocationData({
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Location Error:", error);
    }
  };

  const showPermissionAlert = () => {
    Alert.alert(
      "Permission Required",
      "Please allow location permission in Settings.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return locationData;
};

export default GetLocation;
