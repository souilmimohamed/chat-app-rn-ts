import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AddToChatScreen,
  ChatScreen,
  HomeScreen,
  LoginScreen,
  ProfileScreen,
  SignUpScreen,
  SplashScreen,
} from "./screens";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { RootStackParamList } from "./models/types";

export default function App() {
  const stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <NavigationContainer>
      <Provider store={store}>
        <stack.Navigator screenOptions={{ headerShown: false }}>
          <stack.Screen name="SplashScreen" component={SplashScreen} />
          <stack.Screen name="LoginScreen" component={LoginScreen} />
          <stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <stack.Screen name="HomeScreen" component={HomeScreen} />
          <stack.Screen name="AddToChatScreen" component={AddToChatScreen} />
          <stack.Screen name="ChatScreen" component={ChatScreen} />
          <stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}
