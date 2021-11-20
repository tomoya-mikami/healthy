import { ThreeAxisMeasurement } from 'expo-sensors';
import { MLRequest } from '../components/fugafuga';

const STOP_X_THRESHOLD = 20;
const STOP_Y_THRESHOLD = 20;
const STOP_Z_THRESHOLD_MIN = 95;
const STOP_Z_THRESHOLD_MAX = 105;

export const distributed = (dataList: MLRequest[]): ThreeAxisMeasurement => {
  if (dataList.length === 0) {
    return {
      x: 0,
      y: 0,
      z: 0
    }
  }
  const avarageX = dataList.map(d => d.digx).reduce((sum, value) => { return sum + value; }, 0) / dataList.length;
  const avarageY = dataList.map(d => d.digy).reduce((sum, value) => { return sum + value; }, 0) / dataList.length;
  const avarageZ = dataList.map(d => d.digz).reduce((sum, value) => { return sum + value; }, 0) / dataList.length;
  const deviationX = dataList.map(d => d.digx).reduce((sum, value) => { return sum + ((value - avarageX) * (value - avarageX)); }, 0);
  const deviationY = dataList.map(d => d.digy).reduce((sum, value) => { return sum + ((value - avarageY) * (value - avarageY)); }, 0);
  const deviationZ = dataList.map(d => d.digz).reduce((sum, value) => { return sum + ((value - avarageZ) * (value - avarageZ)); }, 0);
  return {
    x: deviationX / dataList.length,
    y: deviationY / dataList.length,
    z: deviationZ / dataList.length,
  }
}

export const isDataRateStop = (dataList: MLRequest[]): boolean => {
  const stopDataList = dataList.filter(d => {
    const absz = Math.abs(d.digz);
    if (
      d.digx < STOP_X_THRESHOLD &&
      d.digy < STOP_Y_THRESHOLD &&
      STOP_Z_THRESHOLD_MIN < absz &&
      absz < STOP_Z_THRESHOLD_MAX
    ) {
      return true;
    }
  })

  return (stopDataList.length / dataList.length) > 0.6;
}
