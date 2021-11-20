import { unionToLowerObject } from "./utilTypes";

export type stackNames = "Room" | "Top";

export const stackNameObject: unionToLowerObject<stackNames> = {
  top: "Top",
  room: "Room",
} as const;
