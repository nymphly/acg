/**
 * @file
 *
 * Array-tools functionality.
 */

/**
 * Tetster function to define array.
 *
 * @deprecated Use Array.isArray() instead.
 *
 * @param value - Value to be tested.
 * @returns - Whether incoming value is array.
 */
export function isArray(value: unknown): value is [] {
  return Array.isArray(value);
}
