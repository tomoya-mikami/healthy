import React, { FC } from "react";
import { Button } from "native-base";
import { stackNameObject } from "../constants/navigation"

export namespace Buttons {
  export const toRoom: FC = (props: any) => {
    return (
      <Button onPress={() => props.navigation.navigate(stackNameObject.room, {nickname: props.nickname, id: props.id})}>
        { props.title }
      </Button>
    );
  };

  export const toHome: FC = (props: any) => {
    return (
      <Button onPress={() => props.navigation.navigate(stackNameObject.top)}>
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
