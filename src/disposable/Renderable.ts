/**
 * @file
 *
 * Contains abstract Renderable class source code.
 */

import Disposable from './Disposable';
import IRenderable from './IRenderable';

export default abstract class Renderable extends Disposable implements IRenderable {
  public abstract render(): void;
}
