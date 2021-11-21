import React, { FC } from "react";
import { Buttons } from "../components/buttons";
import { MeetURL } from "../components/links";
import { Text, View, StyleSheet, Vibration, ScrollView } from "react-native";
import { CheckIcon, HStack, VStack, CloseIcon, InfoOutlineIcon, SunIcon, MoonIcon } from "native-base";
import { Accelerometer, ThreeAxisMeasurement } from 'expo-sensors';
import { post } from "../utils/rest";
import { distributed, isDataRateStop } from "../utils/calculate";
import { JoinRoom, SendStatus, SetStatusListener, status } from "../utils/websocket";

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
  const [userList, setUserList] = React.useState<{[key: string]: status}>({});
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
    if (res === undefined) { return }
    if (res.status === Status.Question && currentStatus !== Status.Concentration) {
      Vibration.vibrate(300);
    }
    const newUserList = JSON.parse(JSON.stringify(userList))
    newUserList[res.id] = res
    setUserList(newUserList)
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
          if (currentStatus !== Status.Question) {
            if (data.z > 0) {
              setCurrentStatus(Status.Concentration);
              st = Status.Concentration;
            } else {
              setCurrentStatus(Status.OK);
              st = Status.OK;
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
              st = response.status;
              setErrorMessage("");
            }
          }
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
      style={styles.bg}
    >
      <View
        style={styles.container}
      >
        <View style={styles.flavor}>
          <Text style={styles.header1}>グループメンバーの様子</Text>
          <Text style={styles.header2}>分からないことがあったら、</Text>
          <Text style={styles.header2}>遠慮なく手を挙げて質問しましょう。</Text>
        </View>
        <ScrollView>
        <View
          style={{
            borderBottomColor: '#DDD',
            borderBottomWidth: 1,
          }}
        />
        {Object.values(userList).sort((a, b) => a.status - b.status).map(u => {
          return (
            <View key={u.id}>
              <VStack style={styles.user}>
                {u.status === Status.OK && (
                  <HStack>
                    <CheckIcon size="5" mt="0.5" color="emerald.500" />
                    <Text style={styles.statusText}>なんでも聞いて</Text>
                  </HStack>
                )}
                {u.status === Status.Leave && (
                  <HStack>
                    <MoonIcon size="5" mt="0.5" color="black" />
                    <Text style={styles.statusText}>はずしています</Text>
                  </HStack>
                )}
                {u.status === Status.Concentration && (
                  <HStack>
                    <CloseIcon size="5" mt="0.5" color="red.500" />
                    <Text style={styles.statusText}>集中しています</Text>
                  </HStack>
                )}
                {u.status === Status.Question && (
                  <HStack>
                    <InfoOutlineIcon size="5" mt="0.5" color="blue.500" />
                    <Text style={styles.statusText}>聞きたいことがあります！</Text>
                  </HStack>
                )}
                {u.status === Status.Thankyou && (
                  <HStack>
                    <SunIcon size="5" mt="0.5" color="orange.500" />
                    <Text style={styles.statusText}>回答ありがとうございます！</Text>
                  </HStack>
                )}
                <Text style={styles.nameText}>{u.name}</Text>
              </VStack>
              {u.url !== "" && (
                <View style={styles.urlText}>
                  <MeetURL url={u.url}/>
                  {/* <Text style={styles.nameText}>{u.url}</Text> */}
                </View>
              )}
              <View
                style={{
                  borderBottomColor: '#aaa',
                  borderBottomWidth: 1,
                  marginLeft: 20,
                  marginRight: 20,
                }}
              />
            </View>
          )
        })}
        <View style={styles.debugLogWrapper}>
          <Text style={styles.debugLog}>
            x: {round(data.x)} y: {round(data.y)} z: {round(data.z)}
          </Text>
          <Text style={styles.debugLog}>
            disX: {round(threeDistributed.x)} disY: {round(threeDistributed.y)} disZ: {round(threeDistributed.z)}
          </Text>
          <Text style={styles.debugLog}>
            status: {currentStatus}
          </Text>
          <Text style={styles.debugLog}>
            res: {JSON.stringify(res)}
          </Text>
          <Text style={styles.debugLog}>
            {errorMessage}
          </Text>
          <Text style={styles.debugLog}>
            props: {JSON.stringify(props)}
          </Text>
          <Text style={styles.debugLog}>
            nickName: {props.route.params.nickname}
          </Text>
          <Text style={styles.debugLog}>
            id: {props.route.params.id}
          </Text>
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: "#f3ecdc",
    flex: 1,
    paddingTop: 50
  },
  container: {
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 10,
    flex: 1,
    paddingTop: 30,
    margin: 10
  },
  flavor: {
    height: 90,
    // backgroundColor: "#FFF",
    paddingLeft: 30,
  },
  header1: {
    color: "#001e45",
    fontSize: 25,
    fontWeight: "500"
  },
  header2: {
    color: "#555555",
    fontSize: 16,
  },
  nameText: {
    color: "#001e45",
    fontSize: 48,
    fontWeight: "bold",
  },
  user: {
    margin: 12,
    marginLeft: 30,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 100,
    paddingRight: 100,
    marginTop: 10,
    marginBottom: 0
  },
  statusText: {
    marginLeft: 3,
    fontSize: 18,
    color: "#555555"
  },
  urlText: {
    marginLeft: 30
  },
  debugLogWrapper: {
    marginTop: 300,
    marginLeft: 30,
    marginRight: 30,
  },
  debugLog: {
    color: "#aaaaaa"
  }
});
