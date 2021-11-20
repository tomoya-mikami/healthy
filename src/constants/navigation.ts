import { unionToObject, unionToLowerObject } from "./utilTypes";
export type tabNames = "Top" | "Mypage";

export const tabNameObject: unionToLowerObject<tabNames> = {
  top: "Top",
  mypage: "Mypage",
} as const;

export type stackNames = "Home" | "Details" | "Settings";

export const stackNameObject: unionToLowerObject<stackNames> = {
  home: "Home",
  details: "Details",
  settings: "Settings"
} as const;

export type drawerNames = "Home" | "Setting";

export const drawerNameObject: unionToLowerObject<drawerNames> = {
  home: "Home",
  setting: "Setting",
} as const;
