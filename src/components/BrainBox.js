import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import i18n from "../language/i18n";
import { COLORS } from "../utils/COLORS";

const BrainBox = ({ children }) => {
  const navigation = useNavigation();
  const user_lang = useSelector((state) => state.users.user_lang);

  useEffect(() => {
    checkLanguage();
  }, [user_lang]);

  const checkLanguage = async () => {
    try {
      if (user_lang === "ar") {
        await i18n.changeLanguage("ar");
        await AsyncStorage.setItem("user_lang", user_lang);
      } else {
        await i18n.changeLanguage("en");
        await AsyncStorage.setItem("user_lang", user_lang);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>{children}</View>
  );
};

export default BrainBox;
