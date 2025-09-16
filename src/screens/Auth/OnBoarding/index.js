import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import CustomText from "../../../components/CustomText";
import ImageFast from "../../../components/ImageFast";
import ScreenWrapper from "../../../components/ScreenWrapper";
import fonts from "../../../assets/fonts";
import { Images } from "../../../assets/images";
import Icons from "../../../components/Icons";
import { setOnBoarding } from "../../../store/reducer/AuthConfig";
import { setLocation } from "../../../store/reducer/usersSlice";
import { COLORS } from "../../../utils/COLORS";
import GetLocation from "../../../utils/GetLocation";

const { width, height } = Dimensions.get("window");
const slideHeight = height / 1.65;

const OnBoarding = () => {
  const flatListRef = useRef();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const locationData = GetLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const array = [Images.Asset1, Images.Asset2, Images.Asset3];

  useEffect(() => {
    if (
      flatListRef.current &&
      currentIndex >= 0 &&
      currentIndex < array.length
    ) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: currentIndex,
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    dispatch(setLocation(locationData));
  }, [locationData]);

  return (
    <ScreenWrapper
      paddingHorizontal={0.1}
      backgroundColor="#E8F6F2"
      statusBarColor="#E8F6F2"
    >
      <Animated.FlatList
        data={array}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={flatListRef}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          console.error("Failed to scroll to index:", info.index);
        }}
        onMomentumScrollEnd={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / width));
        }}
        initialScrollIndex={currentIndex}
        renderItem={({ item }) => (
          <Animated.View style={styles.sliderItem}>
            <ImageFast source={item} style={styles.img} resizeMode="contain" />
          </Animated.View>
        )}
      />

      <View style={styles.container}>
        <View style={{ paddingHorizontal: 20 }}>
          <CustomText
            label={
              currentIndex === 0
                ? `Drive. Earn. Repeat.`
                : `Accept Rides Instantly`
            }
            fontSize={25}
            fontFamily={fonts.semiBold}
            textAlign="center"
            alignSelf="center"
            marginBottom={10}
            fontWeight={"bold"}
            marginTop={10}
          />

          <CustomText
            label={
              currentIndex === 0
                ? `Join our community of trusted drivers and start earning on your own schedule`
                : `View nearby jobs and pick the ones that suit you.`
            }
            fontSize={20}
            color="#868686"
            marginBottom={30}
            textAlign="center"
            lineHeight={30}
            marginTop={5}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={() => {
            if (currentIndex === array.length - 1) {
              navigation.replace("Login");
              dispatch(setOnBoarding(true));
            } else {
              setCurrentIndex((prev) => prev + 1);
            }
          }}
        >
          <Icons
            family="AntDesign"
            name="arrowright"
            size={50}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  sliderItem: {
    width: width,
    height: slideHeight,
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 260,
    height: 260,
  },
  container: {
    width: width,
    alignItems: "center",
    padding: 25,
    backgroundColor: COLORS.white,
    height: height - slideHeight,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: COLORS.btnColor,
    justifyContent: "center",
    alignItems: "center",
    position:"absolute",
    bottom:30,
    alignSelf: "center"
  },
});
