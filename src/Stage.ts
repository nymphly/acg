import ACGElement from './ACGElement';
import { Nullable } from './types/Nullable';
import { RawElementConfig } from './types/RawElementConfig';

export default class Stage {
  #config: RawElementConfig;
  #wrappers: Map<string, Nullable<ACGElement>> = new Map();
  #rawConfigs: Map<string, RawElementConfig> = new Map();
  #parents: Map<string, string | null> = new Map();

  constructor(config: RawElementConfig) {
    this.#config = config;
    this.parseConfig();
  }

  parseConfig(config: RawElementConfig = this.#config, parentName: Nullable<string> = null): void {
    const { name, content } = config;

    const wrapper: Nullable<ACGElement> | undefined = this.#wrappers.get(name);

    if (wrapper === undefined) {
      /*
        This is just to memoize name met.
        No need to create wrapper immediately.
       */
      this.#wrappers.set(name, null);

      /*
        Store the raw config.
       */
      this.#rawConfigs.set(name, config);

      /*
        Store the parentName (value) for current name (key);
       */
      this.#parents.set(name, parentName);
    } else if (wrapper === null) {
      /*
        Name duplication is found.
        Names must be unique.
       */
      throw `Name duplication: "${name}". Name must be unique, please review the config.`;
    }

    if (Array.isArray(content)) {
      content.forEach((childConfig) => this.parseConfig(childConfig, name));
    }
  }

  find(name: string): ACGElement | undefined {
    const wrapper: Nullable<ACGElement> | undefined = this.#wrappers.get(name);
    if (wrapper === null) {
      const parentName = this.#parents.get(name);
      const rawConfig = <RawElementConfig>this.#rawConfigs.get(name); // This config is not undefined here.

      /*
        Need to create a new wrapper, memoize it and return.
        Null value means that 'name' exists but is not created yet.
       */
      const newWrapper = new ACGElement(this, rawConfig, parentName);
      this.#wrappers.set(name, newWrapper);
      return newWrapper;
    }

    return wrapper;
  }

  render(): void {
    debugger;
    this.#rawConfigs.forEach((key) => console.log(key));
    console.log('Render!');
  }
}
