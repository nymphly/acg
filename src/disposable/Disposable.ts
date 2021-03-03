/**
 * @file
 *
 * Contains abstract Disposable class source code.
 */

import { IDisposable } from '.';

export default abstract class Disposable implements IDisposable {
  #isDisposed = false;

  public get isDisposed(): boolean {
    return this.#isDisposed;
  }

  public set isDisposed(isDisposed: boolean) {
    this.#isDisposed = isDisposed;
  }

  public abstract dispose(): void;
}
