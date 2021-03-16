/**
 * @file
 *
 * ACGElement implementaion.
 */

import { Renderable } from '../disposable';
import { RenderState } from '../enums';
import { Factory } from '../factory';
import { render } from '../rendering';
import { Stage } from '../stage';

export default class ACGElement extends Renderable {
  /**
   * Parent stage reference.
   */
  #stage: Stage;

  /**
   * Whether ACGElement is a wrapper for stage raw config.
   */
  #isStage = false;

  /**
   * Related raw config.
   */
  #rawConfig: RawElementConfig;

  /**
   * Parent element name.
   */
  #parent: Nullable<string>;

  /**
   * Current render state.
   */
  #renderState: number = RenderState.DOM | RenderState.ATTRS | RenderState.CONTENT;

  /**
   * Reference to DOM element.
   */
  #domRef: Nullable<SVGElement> = null;

  /**
   * Sort function for child elements.
   */
  #sort: Nullable<SortingFunction<RawElementConfig>> = null;

  /**
   * Factries storage.
   */
  #factories: Map<string, Factory> = new Map();

  constructor(stage: Stage, rawConfig: RawElementConfig, parent: Nullable<string> = null) {
    super();
    this.#stage = stage;
    this.#rawConfig = rawConfig;
    this.#parent = parent;

    this.#stage.addToRender(this);
  }

  invalidate(state: RenderState): void {
    this.#renderState |= state;
    this.#stage.addToRender(this);
  }

  consistify(state: RenderState): void {
    this.#renderState &= ~state;
    if (this.isConsistent) {
      this.#stage.removeFromRender(this);
    }
  }

  get stage(): Stage {
    return this.#stage;
  }

  get isStage(): boolean {
    return this.#isStage;
  }

  set isStage(isStage: boolean) {
    this.#isStage = isStage;
  }

  get name(): string {
    return this.#rawConfig.name;
  }

  get tag(): string {
    return this.#rawConfig.tag;
  }

  get attrs(): Record<string, NumberOrString> {
    return { ...this.#rawConfig.attrs };
  }

  set attrs(newAttrs: Record<string, NumberOrString>) {
    this.#rawConfig.attrs = { ...newAttrs };
    this.invalidate(RenderState.ATTRS);
  }

  get content(): RawElementContent {
    const { content } = this.#rawConfig;
    return Array.isArray(content) ? [...content] : content || '';
  }

  set content(newContent: RawElementContent) {
    this.#stage.backupContent(this);

    if (Array.isArray(newContent)) {
      this.#rawConfig.content = [...newContent];
      this.#rawConfig.content.forEach((config) => {
        this.#stage.parseConfig(config, this.name);
      });
    } else {
      this.#rawConfig.content = newContent;
    }

    this.invalidate(RenderState.CONTENT);
  }

  get domRef(): Nullable<SVGElement> {
    return this.#domRef;
  }

  set domRef(domElement: Nullable<SVGElement>) {
    this.#domRef = domElement;
  }

  get isConsistent(): boolean {
    return this.#renderState === 0;
  }

  get parent(): Nullable<string> {
    return this.#parent;
  }

  get sort(): Nullable<SortingFunction<RawElementConfig>> {
    return this.#sort;
  }

  set sort(sortingFn: Nullable<SortingFunction<RawElementConfig>>) {
    this.#sort = sortingFn;
  }

  hasRenderState(state: RenderState): boolean {
    return Boolean(this.#renderState & state);
  }

  public factory(name: string, defaultConfig?: RawFactoryConfig): Factory {
    const existingFactory = this.#factories.get(name);
    if (existingFactory) {
      return existingFactory;
    }

    if (!defaultConfig) {
      throw `New factory "${name}" can't be created for element "${this.name}" without default config.`;
    }

    const newFactory = new Factory(name, this.name, <RawFactoryConfig>defaultConfig, this.stage);
    this.#factories.set(name, newFactory);
    return newFactory;
  }

  /**
   * Lightweight implementation of ACGElement's content modification
   * to avoid constructions like this: 
   *   element.content = [...element.content, newElement];
   * 
   * This lightweight method should be used for the multiple element's content
   * modifications (factory case, for example) to avoid multiple putting content
   * to backup and taking it from backup.
   * 
   * @param config - Element config to be added.
   */
  public add(config: RawElementConfig): void {
    if (Array.isArray(this.#rawConfig.content)) {
      this.#rawConfig.content.push(config);
    } else {
      this.#rawConfig.content = [config];
    }
    this.#stage.parseConfig(config, this.name);

    this.invalidate(RenderState.CONTENT);
  }

  public render(): void {
    render(this);
  }

  public dispose(): void {
    throw new Error('Method not implemented.');
  }
}
