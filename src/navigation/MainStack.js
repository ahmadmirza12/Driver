import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddCard from "../screens/Main/AddCard";
import AppSetting from "../screens/Main/AppSetting";
import Chats from "../screens/Main/Chat";
import InboxScreen from "../screens/Main/Chat/InboxScreen";
import Earning from "../screens/Main/Earning";
import EditProfile from "../screens/Main/EditProfile";
import FavoriteLeagues from "../screens/Main/FavoriteLeagues";
import FavoriteSports from "../screens/Main/FavoriteSports";
import GoLive from "../screens/Main/GoLive";
import HelpSupport from "../screens/Main/Help";
import PaymentMethod from "../screens/Main/Payments";
import Privacy from "../screens/Main/Privacy";
import RoomDetail from "../screens/Main/RoomDetail";
import RoomSetting from "../screens/Main/RoomSetting";
import ScheduleEvent from "../screens/Main/ScheduleEvent";
import TabStack from "./TabStack";
import Editowner from "../screens/Main/editowner";
import Editspec from "../screens/Main/Editspec";
import Editdoc from "../screens/Main/Editcoc";
import Editphoto from "../screens/Main/Editphoto";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabStack"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="TabStack" component={TabStack} />
      <Stack.Screen name="ScheduleEvent" component={ScheduleEvent} />
      <Stack.Screen name="InboxScreen" component={InboxScreen} />
      <Stack.Screen name="RoomSetting" component={RoomSetting} />
      <Stack.Screen name="RoomDetail" component={RoomDetail} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="FavoriteSports" component={FavoriteSports} />
      <Stack.Screen name="FavoriteLeagues" component={FavoriteLeagues} />
      <Stack.Screen name="GoLive" component={GoLive} />
      <Stack.Screen name="AppSetting" component={AppSetting}/>
      <Stack.Screen name="PaymentMethod" component={PaymentMethod}/>
      <Stack.Screen name="HelpSupport" component={HelpSupport}/>
      <Stack.Screen name="Privacy" component={Privacy}/>
      <Stack.Screen name="AddCard" component={AddCard}/>
      <Stack.Screen name="Earning" component={Earning}/>
      <Stack.Screen name="Chats" component={Chats}/>
      <Stack.Screen name="Editowner" component={Editowner}/>
      <Stack.Screen name="Editspec" component={Editspec}/>
      <Stack.Screen name="Editdoc" component={Editdoc}/>
      <Stack.Screen name="Editphoto" component={Editphoto}/>

    </Stack.Navigator>
  );
};

export default MainStack;
