/**
 * @file
 *
 * Stage class implementation.
 */

// import { Renderable } from '../disposable';
import Renderable from '../disposable/Renderable';
import ACGElement from '../elements/ACGElement';
import render from '../rendering/render';
// import { ACGElement } from '../elements';
// import { render } from '../rendering';

export default class Stage extends Renderable {
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
   * Map of elements to be rendered.
   */
  #toRender: Map<string, ACGElement> = new Map();

  /**
   * TODO Describe.
   */
  #backupElements: Map<string, ACGElement> = new Map();

  /**
   * Contains raw configurations associated by name.
   */
  #rawConfigs: Map<string, RawElementConfig> = new Map();

  /**
   * Contains map of parent names where
   * - key is name of element
   * - value is name of parent or null (root SVG element case).
   */
  #parents: Map<string, Nullable<string>> = new Map();

  /**
   * Stage dom container.
   */
  #container: Nullable<Element> = null;

  constructor(config: RawElementConfig) {
    super();

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

  public get backupElements(): Map<string, ACGElement> {
    return this.#backupElements;
  }

  public get container(): Nullable<Element> {
    return this.#container;
  }

  public set container(container: Nullable<Element>) {
    this.#container = container;
    // TODO Add null case: null removes from DOM.
  }

  /**
   * TODO DEscribe.
   *
   * @param name - .
   * @returns Qwer.
   */
  public reuse(name: string): Nullable<ACGElement> | undefined {
    if (this.#backupElements.has(name)) {
      const el = <ACGElement>this.#backupElements.get(name);
      this.#backupElements.delete(name);
      this.#elements.set(name, el);
      // TODO what about this.#parents?
      return el;
    }
    return this.#elements.get(name);
  }

  /**
   * TODO Describe.
   *
   * @param config - Raw element config.
   * @param parentName - Name of the parent element.
   * @throws
   */
  public parseConfig(
    config: RawElementConfig = this.#config,
    parentName: Nullable<string> = null,
  ): void {
    const { name, content, tag } = config;

    const element: Nullable<ACGElement> | undefined = this.reuse(name);

    if (element) {
      if (element.tag !== tag) {
        throw `Invalid element reuse: Stage tries to reuse element named "${name}".\nThe "tag" value must be the same (tag from backup is "${element.tag}", requested tag is "${tag}").`;
      }

      const reuseParentName = this.#parents.get(name);
      if (reuseParentName !== parentName) {
        throw `Invalid parent definition on element reuse: Stage tries to reuse element named "${name}".\nParent must be the same (backup parent of "${name}" is "${reuseParentName}", requested parent is "${parentName}").`;
      }
    }

    if (element === undefined) {
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

      if (parentName === null) {
        /*
          This is a little bit hacky: this.find(name) basicly puts a very root (SVG)
          element to this.#toRender and it renders all children on first rendering.

          The hack is in the fact that children become rendered not because 
          wrappers are created and put to this.#toRender, but because all the 
          elements are just invalidated children of stage root wrapper.
         */
        const stageWrapper = this.find(name);
        (<ACGElement>stageWrapper).isStage = true;
      }
    } else if (element === null) {
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

  /**
   * Creates (or uses existing one) ACGElement instance (wrapper over
   * the raw config).
   * Gets only active element (existing in this.#elements), not in this.#backupElements.
   *
   * @param name - Name of element to be found.
   * @returns - Raw config wrapper or undefined if name is not declared in raw configuration.
   */
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

  /**
   * TODO Describe.
   *
   * @param el - Element to backup its content.
   */
  backupContent(el: ACGElement): void {
    const { content } = el;
    if (Array.isArray(content)) {
      content.forEach((childConfig) => {
        const { name } = childConfig;
        const childElement: ACGElement = <ACGElement>this.find(name); // It never must be undefined here.
        this.#backupElements.set(name, childElement);
        this.#elements.delete(name);
        this.backupContent(childElement);
      });
    }
  }

  addToRender(el: ACGElement): void {
    this.#toRender.set(el.name, el);
  }

  removeFromRender(el: ACGElement): void {
    this.#toRender.delete(el.name);
  }

  public render(): void {
    // console.log('Render!');

    for (const key of this.#toRender.keys()) {
      const el = this.find(key);
      render(<ACGElement>el);
      this.#toRender.delete(key);

      // TODO maybe move it to renderer somehow?
      if (el?.isStage) {
        if (this.#container) {
          this.#container.appendChild(<SVGElement>el.domRef);
        } else {
          (<SVGElement>el.domRef).remove();
        }
      }
    }
  }

  public dispose(): void {
    this.isDisposed = true;
    throw new Error('Method not implemented.');
  }
}
