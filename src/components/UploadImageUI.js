import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const UploadImageUI = ({ label, handleChange }) => {
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
        handleChange && handleChange(image);
      }
    } catch (error) {
      console.log("Image Picker Error:", error);
    }
  };

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
            <Image
              source={require("../assets/images/UploadUI.png")}
              style={styles.placeholderIcon}
            />
            <View style={{flexDirection:'row'}}>
            <Text style={styles.placeholderText}>Click to upload Pic</Text>
            <Text style={styles.UploadImageUIText}>or drag and drop</Text>
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
    height:97,
    borderRadius: 12,
    backgroundColor:"#FFFFFF",
    position: "relative",
    width:336
  },
  previewImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius:12
  },
  placeholderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderColor: "#aaa",
  },
  placeholderIcon: {
    width: 30,
    height: 30,
    marginBottom: 8
  },
  placeholderText: {
    fontSize: 10,
    color: "black",
    fontWeight:"500"
  },
  uploadBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#1F5546",
    borderRadius: 20,
    width: 40,
    height: 97,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  iconImg: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  UploadImageUIText:{
    color:'#667085',fontSize:10,fontWeight:'400',left:5
  }
});
