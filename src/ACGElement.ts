import RenderState from './enums/RenderState';
import Stage from './stage/Stage';

export default class ACGElement {
  #stage: Stage;
  #rawConfig: RawElementConfig;
  #parent: Nullable<string>;
  #renderState: number = RenderState.ALL;

  constructor(stage: Stage, rawConfig: RawElementConfig, parent: Nullable<string> = null) {
    this.#stage = stage;
    this.#rawConfig = rawConfig;
    this.#parent = parent;
  }

  invalidate(state: RenderState): void {
    this.#renderState |= state;
  }

  consistify(state: RenderState): void {
    this.#renderState &= ~state;
  }

  get stage(): Stage {
    return this.#stage;
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
    // TODO probably should notify stage about content change.
    this.#rawConfig.content = Array.isArray(newContent) ? [...newContent] : newContent;
    this.invalidate(RenderState.CONTENT);
  }

  get isConsistent(): boolean {
    return !this.#renderState;
  }

  get parent(): Nullable<string> {
    return this.#parent;
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
