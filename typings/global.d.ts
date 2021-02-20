declare type Nullable<T> = T | null;

declare type NumberOrString = number | string;

declare type RawElementAttrs = Record<string, NumberOrString>;

declare type RawElementContent = RawElementConfig[] | NumberOrString;

declare type RawElementConfig = {
  tag: string;
  name: string;
  attrs?: RawElementAttrs;
  content?: RawElementContent;
  // TODO add events
};

declare type UntypedObjectOrArray = Record<NumberOrString, unknown> | Array<unknown>;

declare type SortingFunction<T> = (el1: T, el2: T) => number;
