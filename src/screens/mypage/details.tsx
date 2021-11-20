import React from "react";
import { Buttons } from "../../components/buttons";
import { StyleSheet } from "react-native";
import { View } from "native-base";

import { Fugafuga } from "../../components/fugafuga";

export const details: React.FC = (props: any) => {
  return (
    <View style={styles.container}
      _dark={{ bg: 'blueGray.900' }}
      _light={{ bg: 'blueGray.50' }}>
      <Fugafuga {...props} />
      <Buttons.back {...props} title="back to mypage home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
