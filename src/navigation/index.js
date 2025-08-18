import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "../language/i18n";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

const Stack = createNativeStackNavigator();
const RootNavigation = () => {
  const Token = useSelector((state) => state.authConfig.token);

  const { language } = useSelector((state) => state.users);

  useEffect(() => {
    if (language == "en") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("dr");
    }
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {Token ? (
        <>
          <Stack.Screen name="MainStack" component={MainStack} />
          <Stack.Screen name="AuthStack" component={AuthStack} />
        </>
      ) : (
        <>
          <Stack.Screen name="AuthStack" component={AuthStack} />
          <Stack.Screen name="MainStack" component={MainStack} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
