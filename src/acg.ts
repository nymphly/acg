/**
 * @file
 *
 * Acg default entry point. Probably will be replaced.
 */
import { Pather } from './pather';
import { Stage } from './stage';
import {
  svg
} from './templates';

/**
 * Default stage creating function.
 *
 * @param config - Raw config.
 * @returns - Stage instance to deal with.
 */
export function create(config: RawElementConfig): Stage {
  return new Stage(config);
}

/**
 * Creates pather instance.
 *
 * @returns - Pather instance.
 */
export function pather(): Pather {
  return new Pather();
}

/**
 * 
 */
export const templates = {
  get svg() {
    return svg();
  }
};
