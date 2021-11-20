import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { home } from "../screens/mypage/home";
import { details } from "../screens/mypage/details";
import { stackNameObject } from "../constants/navigation";

const Stack = createStackNavigator();

// home画面の構成を作成
export const mypageNav: React.FC = (props: any) => {
  return (
    <Stack.Navigator
      initialRouteName={stackNameObject.home}
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen
        name={stackNameObject.home}
        options={{ title: "マイページ" }}
        component={home}
      />
      <Stack.Screen
        name={stackNameObject.details}
        options={{ title: "マイページ詳細" }}
        component={details}
      />
    </Stack.Navigator>
  );
};
