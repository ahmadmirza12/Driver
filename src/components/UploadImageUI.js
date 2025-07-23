import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Linking from "expo-linking";

import { showSuccess, showError } from "../utils/toast";
import { post } from "../services/ApiRequest";

const UploadImageUI = ({
  label,
  onImageSelected,
  onUploadComplete,
  initialImage = null,
  compact = false,
  pickerOptions = {},
}) => {
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos in settings",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    if (isUploading) return;
    const permission = await requestPermission();
    if (!permission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: pickerOptions.allowsEditing ?? true,
      quality: pickerOptions.quality || 0.8,
      allowsMultipleSelection: false,
      aspect: pickerOptions.aspect || [4, 3],
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      onImageSelected?.(result.assets[0]);
      try {
        await uploadImage(imageUri);
      } catch (error) {
        // Error handled in uploadImage
      }
    }
  };

  const uploadImage = async (imageUri) => {
    if (!imageUri) {
      showError("No image selected");
      return null;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      const filename = imageUri.split("/").pop();
      const match = /(\.\w+)$/.exec(filename);
      const ext = match ? match[1] : ".jpg";

      // Match the working Postman example format
      formData.append("file", {
        uri: imageUri,
        name: `upload_${Date.now()}${ext}`,
        type: `image/${ext === ".jpg" ? "jpeg" : ext.replace(".", "")}`,
      });

      // Use the same endpoint as the working Postman example
      const response = await axios({
        method: "post",
        url: "https://riderbackend-gbe0.onrender.com/api/files/upload",
        data: formData,
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        maxBodyLength: Infinity,
      });

      console.log("Upload response:", response.data); // Log full response

      if (response.data) {
        // Try different response structures
        const url =
          response.data.url || response.data.data?.url || response.data[0]?.url;

        if (!url) {
          console.error("No URL found in response:", response.data);
          throw new Error("Upload successful but no URL returned");
        }

        setUploadedImageUrl(url);
        showSuccess("Image uploaded successfully");
        onUploadComplete?.(url);
        return url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      let errorMessage = "Failed to upload image. Please try again.";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Upload failed with status ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Upload timed out. Please try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }

      showError(errorMessage);
      Alert.alert("Upload Failed", errorMessage);

      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
      setUploadedImageUrl(initialImage);
    }
  }, [initialImage]);

  if (compact) {
    return (
      <View style={styles.compactWrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
          style={styles.compactContainer}
          onPress={pickImage}
          activeOpacity={0.8}
          disabled={isUploading}
        >
          <View style={styles.compactImageBox}>
            {isUploading ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : selectedImage ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.compactPreviewImg}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={styles.compactPlaceholder}>
                <AntDesign name="plus" size={20} color="#6b7280" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={pickImage}
      activeOpacity={0.8}
      disabled={isUploading}
    >
      <View style={styles.imageBox}>
        {isUploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : selectedImage ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.previewImg}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Upload Image</Text>
          </View>
        )}
      </View>
      {label && <Text style={styles.regularLabel}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  compactWrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#4B5563",
    fontFamily: "Inter-Medium",
  },
  regularLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
  },
  imageBox: {
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  placeholderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    textAlign: "center",
  },
  compactContainer: {
    width: 150,
    height: 70,
  },
  compactImageBox: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  compactPreviewImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8,
  },
  compactPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  successOverlay: {
    position: "absolute",
    top: 5,
    right: 5,
    borderRadius: 20,
    padding: 5,
  },
});

export default UploadImageUI;