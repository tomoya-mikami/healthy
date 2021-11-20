import React, {useState} from "react";
import { StyleSheet, TextInput } from "react-native";
import { View, Center, VStack, Heading, HStack, Text, Code } from "native-base";
import { Buttons } from "../components/buttons";


export const TopScreenn: React.FC = (props: any) => {
  const [nickname, setNickname] = useState('')
  return (
    <View style={styles.container}>
      <Center
        // _dark={{ bg: 'blueGray.900' }}
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
          <TextInput
            placeholder="ニックネームを入力"
            onChangeText={(txt: string) => setNickname(txt)}
          />
          <Buttons.toRoom {...props} title="join" nickname={nickname} id={Date.now().toString()} />
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
