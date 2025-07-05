import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../utils/COLORS";
import CustomModal from "./CustomModal";
import Icons from "./Icons";

const { width, height } = Dimensions.get("window");

const ImageFast = ({
  source,
  style,
  resizeMode = "cover", // 'cover', 'contain', 'fill', etc.
  isView,
  loading,
  children,
  onPress,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isViewModal, setIsViewModal] = useState(false);

  const SkeletonLoader = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }, [animatedValue]);

    const interpolatedBackground = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#e0e0e0", "#c0c0e0"],
    });

    return (
      <View style={styles.skeletonContainer}>
        <Animated.View
          style={[styles.skeleton, { backgroundColor: interpolatedBackground }]}
        />
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={isView ? () => setIsViewModal(true) : onPress}
      activeOpacity={0.6}
      disabled={!isView && !onPress}
      style={[
        style,
        { overflow: "hidden" },
        (loading || isImageLoading) && styles.centered,
      ]}
    >
      {/* Fullscreen image view modal */}
      {isViewModal && (
        <CustomModal
          isBlur
          isVisible={isViewModal}
          onDisable={() => setIsViewModal(false)}
        >
          <Icons
            family="Entypo"
            name="circle-with-cross"
            color={COLORS.white}
            size={30}
            onPress={() => setIsViewModal(false)}
            style={styles.icon}
          />
          <Image
            source={source}
            contentFit="contain"
            style={{ width: width, height: height - 70 }}
            onLoadStart={() => setIsImageLoading(true)}
            onLoadEnd={() => setIsImageLoading(false)}
            transition={300}
          />
        </CustomModal>
      )}

      {/* Image with child support via absolute View */}
      <View style={{ width: "100%", height: "100%" }}>
        <Image
          source={source}
          contentFit={resizeMode}
          style={[StyleSheet.absoluteFill]}
          onLoadStart={() => setIsImageLoading(true)}
          onLoadEnd={() => setIsImageLoading(false)}
          transition={300}
        />
        <View style={styles.absoluteFill}>{children}</View>
      </View>

      {/* Skeleton loader */}
      {(loading || isImageLoading) && (
        <View style={styles.absoluteFill}>
          <SkeletonLoader />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImageFast;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  absoluteFill: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  icon: {
    alignSelf: "flex-end",
    marginBottom: -50,
    marginRight: 10,
    top: Platform.OS === "ios" ? 50 : 0,
    zIndex: 999,
  },
  skeletonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  skeleton: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
