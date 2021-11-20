import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { topNav } from "./top";
import { mypageNav } from "./mypage";
import { settingNav } from "./setting";
import { drawerNameObject, tabNameObject } from "../constants/navigation";
import { SafeAreaView } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
// 全体の画面構成をここで作成してNavigationContainerで囲む
const homeTab: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName={tabNameObject.top}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={tabNameObject.top} component={topNav} />
      <Tab.Screen name={tabNameObject.mypage} component={mypageNav} />
    </Tab.Navigator>
  );
};
const nav: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={drawerNameObject.setting}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name={drawerNameObject.home} component={homeTab} />
        <Drawer.Screen
          name={drawerNameObject.setting}
          component={settingNav}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
export default nav;
