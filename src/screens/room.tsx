import React, { FC } from "react";
import { Buttons } from "../components/buttons";
import { Text,  View  } from "react-native";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';
import { post } from "../utils/rest";
import { distributed, isDataRateStop } from "../utils/calculate";
import { JoinRoom, SendStatus, SetStatusListener, status } from "../utils/websocket";

const UPDATE_MS = 100;
const DATA_QUE_SIZE = 30;
const TEST_URL = "http://1c77-180-39-77-67.ngrok.io/mochiage/1";

export interface MLRequest {
  digx: number,
  digy: number,
  digz: number
  accx: number,
  accy: number,
  accz: number,
}

enum Status {
  Leave = 1,
  Concentration = 2,
  OK = 3,
  Question = 4,
  Thankyou = 5
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
  const [userList, setUserList] = React.useState<status[]>([]);
  const [res, setres] = React.useState<status>();

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

  const updateUserList = (res: status): void => {
    setres(res)
    return
  }

  React.useEffect(() => {
    if (res === undefined) {return}
    setUserList([...userList, res])
  }, [res])

  // 初期化
  React.useEffect(() => {
    (async () => {
        _subscribe();
      Accelerometer.setUpdateInterval(UPDATE_MS);
      JoinRoom()
      SetStatusListener(updateUserList)
    })();
    return () => _unsubscribe();
  }, []);

  React.useEffect(() => {
    let st: number = currentStatus;
    (async () => {
      if (dataQue.length > DATA_QUE_SIZE && !requestLock) {
        setRequestLock(true);
        if (isDataRateStop(dataQue)) {
          if (data.z > 0) {
            setCurrentStatus(Status.Concentration);
            st = Status.Concentration
          } else {
            setCurrentStatus(Status.OK);
            st = Status.OK
          }
          setErrorMessage("");
        } else {
          // const response = await post(TEST_URL, dataQue);
          // if (typeof response === "string") {
          //   setErrorMessage(response);
          // } else {
          //   setErrorMessage("");
          // }
        }
        SendStatus({
          id: props.route.params.id,
          name: props.route.params.nickname,
          status: st,
          url: ""
        })
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
        {userList.map(user => user.name).join('\n')}
      </Text>
      <Text>
        status: {currentStatus}
      </Text>
      <Text>
        res: {JSON.stringify(res)}
      </Text>
      <Text>
        {errorMessage}
      </Text>
      <Text>
        props: {JSON.stringify(props)}
      </Text>
      <Text>
        nickName: {props.route.params.nickname}
      </Text>
      <Text>
        id: {props.route.params.id}
      </Text>
    </View>
  );
};
