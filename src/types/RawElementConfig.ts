import { Nullable } from './Nullable';
import { NumberOrString } from './NumberOrString';

export type RawElementConfig = {
  tag: string;
  name: string;
  attrs?: Record<string, NumberOrString>;
  content?: RawElementConfig[] | Nullable<NumberOrString>;
  // TODO add events
};
