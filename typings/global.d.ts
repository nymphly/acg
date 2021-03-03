/**
 * @file
 *
 * Global types declaration.
 */

declare type Nullable<T> = T | null;

declare type NumberOrString = number | string;

declare type RawElementAttrs = Record<string, NumberOrString>;

declare type RawElementContent = RawElementConfig[] | NumberOrString;

declare type RawFactoryConfig = {
  tag: string;
  attrs?: RawElementAttrs;
  // TODO Probably should add some content support?
};

declare type RawElementConfig = RawFactoryConfig & {
  name: string;
  content?: RawElementContent;
};

declare type UntypedObjectOrArray = Record<NumberOrString, unknown> | Array<unknown>;

declare type SortingFunction<T> = (el1: T, el2: T) => number;
