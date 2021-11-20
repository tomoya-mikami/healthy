import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { stackNameObject } from "../constants/navigation";

import { home } from "../screens/top/home";

const Stack = createStackNavigator();

// home画面の構成を作成
export const topNav: React.FC = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName={stackNameObject.home}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name={stackNameObject.home}
        options={{ title: "トップ" }}
        component={home}
      />
    </Stack.Navigator>
  );
};
