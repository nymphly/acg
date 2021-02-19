import ACGElement from '../ACGElement';

export default class Stage {
  /**
   * Storage of current raw config.
   */
  #config: RawElementConfig;

  /**
   * Map that contatins wrappers over the raw element configurations.
   * Each raw element config must contain unique name.
   *
   * While parsing the raw config with this.parseConfig(), map
   * is filled with 'null' values. Config will be wrapped with ACGElement
   * wrapper only by acceessing as stage.find(name).
   */
  #elements: Map<string, Nullable<ACGElement>> = new Map();

  /**
   * Map that contains
   */
  #disposables: Map<string, ACGElement> = new Map();

  #rawConfigs: Map<string, RawElementConfig> = new Map();
  #parents: Map<string, Nullable<string>> = new Map();

  constructor(config: RawElementConfig) {
    this.#config = config;
    this.parseConfig();
  }

  public get config(): RawElementConfig {
    return this.#config;
  }

  public get elements(): Map<string, Nullable<ACGElement>> {
    return this.#elements;
  }

  public get rawConfigs(): Map<string, RawElementConfig> {
    return this.#rawConfigs;
  }

  public get parents(): Map<string, Nullable<string>> {
    return this.#parents;
  }

  public reuse(name: string): Nullable<ACGElement> | undefined {
    if (this.#disposables.has(name)) {
      const el = <ACGElement>this.#disposables.get(name);
      this.#disposables.delete(name);
      this.#elements.set(name, el);
      // TODO what about this.#parents?
      return el;
    }
    return this.#elements.get(name);
  }

  public parseConfig(
    config: RawElementConfig = this.#config,
    parentName: Nullable<string> = null,
  ): void {
    const { name, content } = config;

    const wrapper: Nullable<ACGElement> | undefined = this.#elements.get(name);

    if (wrapper === undefined) {
      /*
        This is just to memoize name met.
        No need to create wrapper immediately.
       */
      this.#elements.set(name, null);

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

  public find(name: string): ACGElement | undefined {
    const wrapper: Nullable<ACGElement> | undefined = this.#elements.get(name);
    if (wrapper === null) {
      const parentName = this.#parents.get(name);
      const rawConfig = <RawElementConfig>this.#rawConfigs.get(name); // This config is not undefined here.

      /*
        Need to create a new wrapper, memoize it and return.
        Null value means that 'name' exists but is not created yet.
       */
      const newWrapper = new ACGElement(this, rawConfig, parentName);
      this.#elements.set(name, newWrapper);
      return newWrapper;
    }

    return wrapper;
  }

  public render(): void {
    debugger;
    this.#rawConfigs.forEach((value, key) => console.log(key, value));
    console.log('Render!');
  }
}
