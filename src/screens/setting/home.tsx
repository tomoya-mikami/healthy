import React from "react";
import { StyleSheet } from "react-native";
import { Box, Text, Center } from "native-base";

export const home: React.FC = (props: any) => {
  return (
    <Box
      style={styles.container}>
      <Center
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={4}
        flex={1}
      >
        <Text color="black">hogehoge</Text>
      </Center>
    </Box >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
