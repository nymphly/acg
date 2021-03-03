/**
 * @file
 *
 * Acg default entry point. Probably will be replaced.
 */
import { Stage } from './stage';

/**
 * Default stage creating function.
 *
 * @param config - Raw config.
 * @returns - Stage instance to deal with.
 */
export function create(config: RawElementConfig): Stage {
  return new Stage(config);
}
