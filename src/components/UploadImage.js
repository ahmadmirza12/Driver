import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { COLORS } from "../utils/COLORS";

const UploadImage = (props) => {
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
        props.handleChange(image); // Pass selected image to parent
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
      <View style={styles.imageWrapper}>
        <Image
          source={
            selectedImage
              ? { uri: selectedImage }
              : require("../assets/images/account.png")
          }
          style={styles.accountImg}
        />
        <Image
          source={require("../assets/images/ImageIcon.png")}
          style={styles.iconImg}
        />
      </View>
    </TouchableOpacity>
  );
};

export default UploadImage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop:20
  },
  imageWrapper: {
    width: 91,
    height: 91,
    position: "relative",
  },
  accountImg: {
    width: "100%",
    height: "100%",
    borderRadius: 45.5,
    resizeMode: "cover",
    backgroundColor: COLORS.lightGray,
  },
  iconImg: {
    width: 36,
    height: 36,
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor:'#1F5546',
    borderRadius:20,
    borderWidth:1.5,
    borderColor:'white'
  },
});
