import { RenderState } from '../enums';
import { Stage } from '../stage';

export default class ACGElement {
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

  #sort: Nullable<SortingFunction<RawElementConfig>> = null;

  constructor(stage: Stage, rawConfig: RawElementConfig, parent: Nullable<string> = null) {
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

  /*
    TODO 

    1) Add DOM-reference support!!!
    2) Add passive DOM-reference support: element can be rendered by
       stage.#config rendering, but not be linked to ACGElement wrapper.
    3) Add disposing support to completely destroy the element.
    4) Add removing support to remove element from DOM with an ability to put it back as DOM.

   */
}
