import React from "react";
import { Link, Text } from "native-base";

export const LearnNativeBase: React.FC = () => {
  return (
    <Link href='https://docs.nativebase.io' isExternal>
      <Text color='primary.500' underline fontSize={'xl'}>
        Learn NativeBase
      </Text>
    </Link>
  )
}
