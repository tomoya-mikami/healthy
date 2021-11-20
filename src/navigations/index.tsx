import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { stackNameObject } from "../constants/navigation";
import { TopScreenn } from "../screens/top";
import { RoomScreen } from "../screens/room";
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();
// 全体の画面構成をここで作成してNavigationContainerで囲む
const nav: React.FC = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={stackNameObject.top}
          screenOptions={{ headerShown: true }}
        >
          <Stack.Screen
            name={stackNameObject.room}
            options={{ title: "ルーム詳細" }}
            component={RoomScreen}
          />
          <Stack.Screen
            name={stackNameObject.top}
            options={{ title: "トップ" }}
            component={TopScreenn}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
};
export default nav;
