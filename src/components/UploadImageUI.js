import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const UploadImageUI = ({ label, onImageSelected, compact = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return false;
    }
    return true;
  };

  const openImagePicker = async () => {
    const permission = await requestPermission();
    if (!permission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        const image = result.assets[0];
        setSelectedImage(image.uri);
        onImageSelected && onImageSelected(image);
      }
    } catch (error) {
      console.log("Image Picker Error:", error);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={openImagePicker}
        activeOpacity={0.8}
      >
        
        <View style={styles.compactImageBox}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.compactPreviewImg} />
          ) : (
            <View style={styles.compactPlaceholder}>
              <AntDesign name="plus" size={20} color="#6b7280" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openImagePicker}
      activeOpacity={0.8}
    >
      <View style={styles.imageBox}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImg} />
        ) : (
          <View style={styles.placeholderBox}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
              <Text style={styles.placeholderText}>Upload</Text>
              <Text style={styles.uploadImageUIText}> or drag and drop</Text>
            </View>
          </View>
        )}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

export default UploadImageUI;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  imageBox: {
    height: 100,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#d1d5db",
    position: "relative",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  uploadImageUIText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '400',
    textAlign: "center",
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
  },
  // Compact styles for inline uploads
  compactContainer: {
    width: 50,
    height: 50,
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
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
  },
  compactPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    width: 20,
    height: 20,
    tintColor: "#9ca3af",
  },
});