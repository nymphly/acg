/**
 * @file
 *
 * Contains abstract Renderable class source code.
 */

import { Disposable, IRenderable } from '.';

export default abstract class Renderable extends Disposable implements IRenderable {
  public abstract render(): void;
}
