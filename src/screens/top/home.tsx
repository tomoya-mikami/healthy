import React from "react";
import { StyleSheet } from "react-native";
import { View, Center, VStack, Heading, HStack, Text, Link, Code } from "native-base";
import { DarkMode } from "../../components/toggles";
import { LearnNativeBase } from "../../components/links";


export const home: React.FC = (props: any) => {
  return (
    <View style={styles.container}>
      <Center
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems='center'>
          <Heading size='lg'>Welcome to NativeBase</Heading>
          <HStack space={2} alignItems='center'>
            <Text>Edit</Text>
            <Code>App.tsx</Code>
            <Text>and save to reload.</Text>
          </HStack>
          <LearnNativeBase />
          <DarkMode />
        </VStack>
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
