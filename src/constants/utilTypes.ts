export type unionToObject<T extends string> = {
  [key in T]: key;
};

export type unionToLowerObject<T extends string> = {
  [key in T as Lowercase<key>]: key;
};
