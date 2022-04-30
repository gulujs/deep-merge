export type IsMergeableObjectFunc<T = unknown> = (value: T) => boolean;
export type ArrayMergeFunc = (target: unknown[], source: unknown[], path: Array<string | number | symbol>, mergeProgram: DeepMergeProgram) => unknown[];
export type ObjectMergeFunc = (target: object, source: object, path: Array<string | number | symbol>, mergeProgram: DeepMergeProgram) => object;
export type CustomMergeFunc = (path: Array<string | number | symbol>) => (target: unknown, source: unknown, path: Array<string | number | symbol>, mergeProgram: DeepMergeProgram) => unknown;

export interface DeepMergeOptions {
  isMergeableObject?: IsMergeableObjectFunc;
  arrayMerge?: ArrayMergeFunc;
  objectMerge?: ObjectMergeFunc;
  customMerge?: CustomMergeFunc;
  /**
   * @default true
   */
  clone?: boolean;
  /**
   * @default true
   */
  includeSymbol?: boolean;
}

export type MergeResult<T, S>
  = S extends Array<infer RS>
    ? (T extends Array<infer RT> ? Array<RS | RT> : S)
    : (
      S extends object
      ? (T extends object ? T & S : S)
      : S
    );

export class DeepMergeProgram {
  isMergeableObject: IsMergeableObjectFunc;
  arrayMerge: ArrayMergeFunc;
  objectMerge: ObjectMergeFunc;
  customMerge: CustomMergeFunc;
  clone: boolean;
  includeSymbol: boolean;

  constructor(options: DeepMergeOptions);

  merge<T, S>(target: T, source: S): MergeResult<T, S>;
  merge<T>(target: Partial<T>, source: Partial<T>): T;
  merge<T, S>(target: T, source: S, path: Array<string | number | symbol>): MergeResult<T, S>;
  merge<T>(target: Partial<T>, source: Partial<T>, path: Array<string | number | symbol>): T;
  mergeUnlessCustomSpecified<T, S>(target: T, source: S, path: Array<string | number | symbol>): MergeResult<T, S>;
  mergeUnlessCustomSpecified<T>(target: Partial<T>, source: Partial<T>, path: Array<string | number | symbol>): T;
  cloneUnlessOtherwiseSpecified<T = unknown>(value: T): T;
  deepClone<T = unknown>(value: T, stack?: string): T;
  getKeys(object: unknown): Array<string | symbol>;
  getEnumerableOwnPropertySymbols(object: unknown): symbol[];
  propertyIsOnObject(object: unknown, property: string | symbol): boolean;
  propertyIsUnsafe(object: unknown, property: string | symbol): boolean;
}

export function deepMerge<T, S>(target: T, source: S, options?: DeepMergeOptions): MergeResult<T, S>;
export function deepMerge<T>(target: Partial<T>, source: Partial<T>, options?: DeepMergeOptions): T;
