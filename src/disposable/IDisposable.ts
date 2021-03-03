/**
 * @file
 *
 * IDisposable interface description.
 */

export default interface IDisposable {
  isDisposed: boolean;
  dispose(): void;
}
