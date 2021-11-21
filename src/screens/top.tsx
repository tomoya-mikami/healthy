import React, {useState} from "react";
import { Image, ImageBackground, StyleSheet, TextInput, Text} from "react-native";
import { View, Center, VStack, Heading, HStack, Code, Box } from "native-base";
import { Buttons } from "../components/buttons";


export const TopScreenn: React.FC = (props: any) => {
  const [nickname, setNickname] = useState('')
  return (
    <Box style={styles.container}>
      <ImageBackground source={require("../../assets/bg.png")} resizeMode="cover" style={styles.bgimage}>
        <Center
          px={4}
          flex={1}
        >
          <Image source={require("../../assets/logo.png")} resizeMode="cover" style={styles.image} />
          <VStack space={5} alignItems='center'>
            <TextInput
              style={styles.textInput}
              placeholder="ニックネームを入力"
              onChangeText={(txt: string) => setNickname(txt)}
            />
            <Buttons.toRoom {...props} style={styles.joinButton} title="join" nickname={nickname} id={Date.now().toString()} />
          </VStack>
        </Center>
      </ImageBackground>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3ecdc",
    flex: 1
  },
  bgimage: {
    justifyContent: "center",
    flex: 1,
  },
  image: {
    justifyContent: "center",
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "bold"
  },
  textInput: {
    textAlign: "center",
    fontSize: 18,
    width: 300,
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    marginBottom: 0
  },
  joinButton: {
    backgroundColor: "#fd8814"
  }
});
