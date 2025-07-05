import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Platform, StyleSheet } from 'react-native';

import fonts from '../assets/fonts';
import { tabIcons } from '../assets/images/tabIcons';
import Account from '../screens/Main/Account';
import Home from '../screens/Main/Home';
import Message from '../screens/Main/Rooms';
import Jobs from '../screens/Main/Search';
import { COLORS } from '../utils/COLORS';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.btnColor,
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: fonts.regular,
          marginTop: 5,
        },
        tabBarStyle: {
          height: Platform.OS === 'android' ? 75 : 85,
          backgroundColor: COLORS.white,
          paddingBottom: 15,
          paddingTop: 5,
        },
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.HomeIcon}
              style={[
                styles.icon,
                { tintColor: focused ? COLORS.btnColor : 'gray' },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={Jobs}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.Case}
              style={[
                styles.icon,
                { tintColor: focused ? COLORS.btnColor : 'gray' },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.Message}
              style={[
                styles.icon,
                { tintColor: focused ? COLORS.btnColor : 'gray' },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={tabIcons.UserIcon}
              style={[
                styles.icon,
                { tintColor: focused ? COLORS.btnColor : 'gray' },
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStack;

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
