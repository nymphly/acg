import { NumberOrString } from './NumberOrString';

export type RawElementAttrs = Record<string, NumberOrString>;

export type RawElementContent = RawElementConfig[] | NumberOrString;

export type RawElementConfig = {
  tag: string;
  name: string;
  attrs?: RawElementAttrs;
  content?: RawElementContent;
  // TODO add events
};
