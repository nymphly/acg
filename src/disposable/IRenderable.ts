/**
 * @file
 *
 * IRenderable interface description.
 */

import { IDisposable } from '.';

export default interface IRenderable extends IDisposable {
  render(): void;
}
