import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

//screens
import AllDone from '../screens/Auth/AllDone';
import ForgotPass from '../screens/Auth/ForgotPass';
import GetStarted from '../screens/Auth/GetStarted';
import Login from '../screens/Auth/Login';
import NewPass from '../screens/Auth/NewPass';
import OnBoarding from '../screens/Auth/OnBoarding';
import OTPScreen from '../screens/Auth/OTPScreen';
import Profile from '../screens/Auth/Profile';
import Signup from '../screens/Auth/Signup';
import SplashScreen from '../screens/Auth/SplashScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {

  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name='GetStarted' component={GetStarted} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ForgotPass" component={ForgotPass} />
      <Stack.Screen name="NewPass" component={NewPass} />
      <Stack.Screen name='AllDone' component={AllDone} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AuthStack;
