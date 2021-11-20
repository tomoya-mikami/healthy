import React, { FC } from "react";
import { Text, View } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';

const UPDATE_MS = 100;

const round = (n: number | null) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100);
};

export const Fugafuga: FC = (props: any) => {
  const [data, setData] = React.useState<ThreeAxisMeasurement>({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = React.useState<any | undefined>(
    undefined
  );

  const _subscribe = () => {
    const listener = Accelerometer.addListener((accelerometerData) => {
      const logJson = {
        x: round(accelerometerData.x),
        y: round(accelerometerData.y),
        z: round(accelerometerData.z)
      };
      console.log(logJson);
      setData(accelerometerData);
    });
    setSubscription(listener);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    return;
  };

  // 初期化
  React.useEffect(() => {
    (async () => {
        _subscribe();
        Accelerometer.setUpdateInterval(UPDATE_MS);
    })();
    return () => _unsubscribe();
  }, []);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
    </View>
  );
};
