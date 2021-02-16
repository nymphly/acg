import RenderState from './enums/RenderState';
import Stage from './Stage';
import { Nullable } from './types/Nullable';
import { NumberOrString } from './types/NumberOrString';
import { RawElementConfig, RawElementContent } from './types/RawElementConfig';

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
}
