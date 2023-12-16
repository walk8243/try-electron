export type RecordValue<T, K> = K extends keyof T ? T[K] : never;
