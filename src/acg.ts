import Stage from './Stage';
import { RawElementConfig } from './types/RawElementConfig';

export function create(config: RawElementConfig): Stage {
  return new Stage(config);
}
