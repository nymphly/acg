import { Stage } from './stage';

export function create(config: RawElementConfig): Stage {
  return new Stage(config);
}
