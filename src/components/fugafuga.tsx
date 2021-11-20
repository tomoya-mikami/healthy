import React, { FC } from "react";
import { Text, View } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';
import { post } from "../utils/request";

const UPDATE_MS = 100;
const DATA_QUE_SIZE = 30;
const TEST_URL = "http://1c77-180-39-77-67.ngrok.io/mochiage/1";

interface MLRequest {
  digx: number,
  digy: number,
  digz: number
  //acc: ThreeAxisMeasurement
}

const diffMeasurement = (
  before: ThreeAxisMeasurement,
  after: ThreeAxisMeasurement
): number => {
  const beforeValue = round(before.x);
  const afterValue = round(after.x);

  return afterValue - beforeValue;
};

const round = (n: number | null) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100);
};

export const Fugafuga: FC = (props: any) => {
  const [data, setData] = React.useState<ThreeAxisMeasurement>({ x: 0, y: 0, z: 0 });
  const [lastThreeAxisMeasurement, setLastThreeAxisMeasurement] = React.useState<
    ThreeAxisMeasurement
  >({ x: 0, y: 0, z: 0 });
  const [dataQue, setDataQue] = React.useState<MLRequest[]>([]);
  const [subscription, setSubscription] = React.useState<any | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = React.useState("");

  const _subscribe = () => {
    const listener = Accelerometer.addListener((accelerometerData) => {
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
  React.useEffect(() => {
    (async () => {
      if (dataQue.length > DATA_QUE_SIZE) {
        const response = await post(TEST_URL, dataQue);
        if (typeof response === "string") {
          setErrorMessage(response);
        }
        setDataQue([]);
      }
    })();
  }, [dataQue]);
  React.useEffect(() => {
    (async () => {
      const accRequest: MLRequest = {
        digx: round(data.x),
        digy: round(data.y),
        digz: round(data.z)
      };
      const newDataQue: MLRequest[] = JSON.parse(JSON.stringify(dataQue));
      newDataQue.push(accRequest);
      setDataQue(newDataQue);
    })();
  }, [data]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Text>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
      <Text>
        {JSON.stringify(dataQue)}
      </Text>
      <Text>
        {errorMessage}
      </Text>
    </View>
  );
};
