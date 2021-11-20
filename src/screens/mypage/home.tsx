import React from "react";
import { Buttons } from "../../components/buttons";
import { StyleSheet } from "react-native";
import { View } from "native-base";

import { Fugafuga } from "../../components/fugafuga";

export const home: React.FC = (props: any) => {
  return (
    <View style={styles.container}>
      <Fugafuga {...props} />
      <Buttons.toDetails {...props} title="go to mypage detail" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
