import React, { FC } from "react";
import { Buttons } from "../components/buttons";
import { Text,  View  } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';
import { post } from "../utils/rest";
import { distributed, isDataRateStop } from "../utils/calculate";

const UPDATE_MS = 100;
const DATA_QUE_SIZE = 30;
const TEST_URL = "http://1c77-180-39-77-67.ngrok.io/mochiage/1";
const ML_URL = "https://healthy-ml-api-exggbigdnq-an.a.run.app/classifier";

export interface MLRequest {
  digx: number,
  digy: number,
  digz: number
  accx: number,
  accy: number,
  accz: number,
}

interface MLRequestWithStatus {
  actions: MLRequest[];
  status: number;
}

enum Status {
  Leave = 1,
  Concentration = 2,
  OK = 3,
  Question = -1,
  Thankyou = -2
}

const round = (n: number | null) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100);
};

export const RoomScreen: FC = (props: any) => {
  const [data, setData] = React.useState<ThreeAxisMeasurement>({ x: 0, y: 0, z: 0 });
  const [lastThreeAxisMeasurement, setLastThreeAxisMeasurement] = React.useState<
    ThreeAxisMeasurement
  >({ x: 0, y: 0, z: 0 });
  const [dataQue, setDataQue] = React.useState<MLRequest[]>([]);
  const [subscription, setSubscription] = React.useState<any | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = React.useState("");
  const [requestLock, setRequestLock] = React.useState(false);
  const [threeDistributed, setThreeDistributed] = React.useState<ThreeAxisMeasurement>({ x: 0, y: 0, z: 0 });
  const [currentStatus, setCurrentStatus] = React.useState(Status.OK);

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
      if (dataQue.length > DATA_QUE_SIZE && !requestLock) {
        setRequestLock(true);
        if (isDataRateStop(dataQue)) {
          if (currentStatus !== Status.Question) {
            if (data.z > 0) {
              setCurrentStatus(Status.Concentration);
            } else {
              setCurrentStatus(Status.OK);
            }
          }
          setErrorMessage("");
        } else {
          if (currentStatus !== Status.Leave) {
            const mlRequest: MLRequestWithStatus = {
              actions: dataQue,
              status: currentStatus
            }
            const response = await post<{ status: number }>(ML_URL, mlRequest);
            if (typeof response === "string") {
              setErrorMessage(response);
            } else {
              setCurrentStatus(response.status);
              setErrorMessage("");
            }
          }
        }
        setDataQue([]);
        setThreeDistributed(distributed(dataQue));
        setRequestLock(false);
      }
    })();
  }, [dataQue]);
  React.useEffect(() => {
    (async () => {
      const roundX = round(data.x);
      const roundY = round(data.y);
      const roundZ = round(data.z);
      const beforeRoundX = round(lastThreeAxisMeasurement.x);
      const beforeRoundY = round(lastThreeAxisMeasurement.y);
      const beforeRoundZ = round(lastThreeAxisMeasurement.z);
      const accRequest: MLRequest = {
        digx: roundX,
        digy: roundY,
        digz: roundZ,
        accx: (beforeRoundX - roundX) * UPDATE_MS,
        accy: (beforeRoundY - roundY) * UPDATE_MS,
        accz: (beforeRoundZ - roundZ) * UPDATE_MS
      };
      const newDataQue: MLRequest[] = JSON.parse(JSON.stringify(dataQue));
      newDataQue.push(accRequest);
      setDataQue(newDataQue);
      setLastThreeAxisMeasurement(data);
    })();
  }, [data]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Buttons.back {...props} title="Back to top"/>
      <Text>
        x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
      </Text>
      <Text>
        disX: {threeDistributed.x} disY: {threeDistributed.y} disZ: {threeDistributed.z}
      </Text>
      <Text>
        status: {currentStatus}
      </Text>
      <Text>
        {errorMessage}
      </Text>
    </View>
  );
};
