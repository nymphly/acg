import Stage from './Stage';
import { Nullable } from './types/Nullable';
import { RawElementConfig } from './types/RawElementConfig';

export default class ConfigWrapper {
  #stage: Stage;
  #rawConfig: RawElementConfig;
  #parent: Nullable<string>;

  constructor(stage: Stage, rawConfig: RawElementConfig, parent: Nullable<string> = null) {
    this.#stage = stage;
    this.#rawConfig = rawConfig;
    this.#parent = parent;

    console.log('stage', this.#stage);
    console.log('rawConfig', this.#rawConfig);
    console.log('parent', this.#parent);
  }
}
