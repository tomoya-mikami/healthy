import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { home } from "../screens/setting/home";
import { stackNameObject } from "../constants/navigation";

const Stack = createStackNavigator();

// home画面の構成を作成
export const settingNav: React.FC = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName={stackNameObject.settings}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name={stackNameObject.settings}
        options={{ title: "セーフ" }}
        component={home}
      />
    </Stack.Navigator>
  );
};
