import Stage from './stage/Stage';

export function create(config: RawElementConfig): Stage {
  return new Stage(config);
}
