/**
 * @file
 *
 * Factory class implementation.
 */

import { Renderable } from '../disposable';
import { ACGElement } from '../elements';
import { Stage } from '../stage';

export default class Factory extends Renderable {
  #name: string;
  #defaultConfig: RawFactoryConfig;
  #parentElementName: string;
  #pool: RawElementConfig[] = [];
  #stage: Nullable<Stage> = null;

  #curentElementIndex = 0;

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
    return `${this.#parentElementName}-${this.#name}-${this.#curentElementIndex}`;
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
    const index = this.#curentElementIndex++;
    const parent: ACGElement | undefined = this.#stage?.find(this.#parentElementName);
    if (parent) {
      const el: RawElementConfig = this.use(index);
      
      // This will merge default attributes with incoming ones. Probably should redefine.
      el.attrs = {
        ...el.attrs,
        ...attrs
      };
      parent.add(el);

      return <ACGElement>this.#stage?.find(el.name);
    }
    throw `ACG factory bug: add() is failed for factory "${this.#name}" of element "${
      this.#parentElementName
    }". Please debug it!`;
  }

  public clear(): void {
    this.#curentElementIndex = 0;
    const parent: ACGElement | undefined = this.#stage?.find(this.#parentElementName);
    if (parent && this.#pool.length) {
      // pool.length MUST guarantee that parent.content is an array.
      parent.content = (parent.content as RawElementConfig[]).filter(
        (el) => !this.#pool.includes(el),
      );
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
