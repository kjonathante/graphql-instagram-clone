import { createStackNavigator, createSwitchNavigator } from "react-navigation";

import HomeScreen from "../HomeScreen/HomeScreen";
import OtherScreen from "../OtherScreen/OtherScreen";
import SignInScreen from "../SignInScreen/SignInScreen";
import AuthLoadingScreen from "../AuthLoadingScreen/AuthLoadingScreen";

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);
