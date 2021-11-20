import React, {useState} from "react";
import { StyleSheet, TextInput,   Text} from "react-native";
import { View, Center, VStack, Heading, HStack, Code, Box } from "native-base";
import { Buttons } from "../components/buttons";


export const TopScreenn: React.FC = (props: any) => {
  const [nickname, setNickname] = useState('')
  return (
    <Box style={styles.container}>
      <Center
        // _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={4}
        flex={1}
      >
      <Text style={styles.nameText}>Syncる</Text>
      <VStack space={5} alignItems='center'>
        <TextInput
          placeholder="ニックネームを入力"
          onChangeText={(txt: string) => setNickname(txt)}
        />
        <Buttons.toRoom {...props} title="join" nickname={nickname} id={Date.now().toString()} />
      </VStack>
      </Center>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  nameText: {
    fontSize: 64,
    fontWeight: "bold"
  },
});
