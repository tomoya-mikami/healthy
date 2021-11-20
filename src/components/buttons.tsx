import React, { FC } from "react";
import { Button } from "native-base";

export namespace Buttons {
  export const toDetails: FC = (props: any) => {
    return (
      <Button onPress={() => props.navigation.navigate("Details")}>
        {props.title}
      </Button>
    );
  };

  export const toHome: FC = (props: any) => {
    return (
      <Button onPress={() => props.navigation.navigate("Home")}>
        {props.title}
      </Button>
    );
  };

  export const back: FC = (props: any) => {
    return (
      <Button onPress={() => props.navigation.goBack()}>{props.title}</Button>
    );
  };
}
