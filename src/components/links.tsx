import React from "react";
import { Link, Text } from "native-base";

export const MeetURL: React.FC<{url: string}> = (props: {url: string}) => {
  return (
    <Link href={props.url} isExternal>
      <Text color='primary.500' underline fontSize={'xl'}>
        meetにログインする
      </Text>
    </Link>
  )
}
