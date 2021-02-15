import Stage from './Stage';
import { RawElementConfig } from './types/RawElementConfig';

export const acg = {
  create(config: RawElementConfig): Stage {
    return new Stage(config);
  },
};
