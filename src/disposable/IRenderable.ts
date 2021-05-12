/**
 * @file
 *
 * IRenderable interface description.
 */

import IDisposable from './IDisposable';

export default interface IRenderable extends IDisposable {
  render(): void;
}
