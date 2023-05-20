import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Signin from '../screens/authentication/signin/Signin';
import Signup from '../screens/authentication/signup/Signup';
import Splash from '../pages/Splash';
import Parent from '../pages/Parent';

const Stack = createStackNavigator();

const StackNavigatior = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Signin}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Parent"
          component={Parent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigatior;
