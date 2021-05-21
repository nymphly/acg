/**
 * @file
 *
 * Factory class implementation.
 */

import ACGElement from '../elements/ACGElement';
import Renderable from '../disposable/Renderable';
import RenderState from '../enums/RenderState';
import Stage from '../stage/Stage';

export default class Factory extends Renderable {
  #name: string;
  #defaultConfig: RawFactoryConfig;
  #parentElementName: string;
  #pool: RawElementConfig[] = [];
  #stage: Nullable<Stage> = null;

  #currentElementIndex = 0;

  constructor(
    name: string,
    parentElementName: string,
    defaultConfig: RawFactoryConfig,
    stage: Stage,
  ) {
    super();

    this.#name = name;
    this.#parentElementName = parentElementName;
    this.#defaultConfig = defaultConfig;
    this.#stage = <Stage>stage;
  }

  get nextName(): string {
    return `${this.#parentElementName}-${this.#name}-${this.#currentElementIndex}`;
  }

  use(index: number): RawElementConfig {
    const existingConfig: RawElementConfig | undefined = this.#pool[index];
    if (existingConfig) {
      return <RawElementConfig>existingConfig;
    } else {
      const newConfig: RawElementConfig = {
        ...this.#defaultConfig,
        name: this.nextName,
      };

      this.#pool.push(newConfig);

      return newConfig;
    }
  }

  public add(attrs?: RawElementAttrs): ACGElement {
    const index = this.#currentElementIndex++;
    const parent: ACGElement | undefined = this.#stage?.find(this.#parentElementName);
    if (parent) {
      const el: RawElementConfig = this.use(index);

      // This will merge default attributes with incoming ones. Probably should redefine.
      el.attrs = {
        ...el.attrs,
        ...attrs,
      };

      parent.add(el);

      const element = <ACGElement>this.#stage?.find(el.name);
      element.parentFactory = this;
      element.invalidate(RenderState.ATTRS);
      return element;
    }
    throw `ACG factory bug: add() is failed for factory "${this.#name}" of element "${
      this.#parentElementName
    }". Please debug it!`;
  }

  public clear(): void {
    this.#currentElementIndex = 0;
    if (this.#stage) {
      const parent: ACGElement | undefined = this.#stage.find(this.#parentElementName);
      if (parent && this.#pool.length) {
        const stage: Stage = this.#stage;
        // pool.length MUST guarantee that parent.content is an array.
        parent.content = (parent.content as RawElementConfig[]).filter(
          (parentRawConfig) => stage.find(parentRawConfig.name)?.parentFactory !== this,
        );
      }
    }
  }

  public render(): void {
    const parent: ACGElement | undefined = this.#stage?.find(this.#parentElementName);
    parent?.render();
  }

  public dispose(): void {
    this.isDisposed = true;
    throw new Error('Method not implemented.');
  }
}
