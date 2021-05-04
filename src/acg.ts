/**
 * @file
 *
 * Acg default entry point. Probably will be replaced.
 */

import { Pather } from './pather';
import { Stage } from './stage';
import { svg } from './templates';

declare global {
  const $$PERFORMANCE_MONITORING$$: boolean;
  const $$DEVELOP_VERSION$$: boolean;
}

// TODO Probably these values are set incorrectly here.
export const PERFORMANCE_MONITORING: boolean =
  $$PERFORMANCE_MONITORING$$ === undefined ? false : $$PERFORMANCE_MONITORING$$;

export const DEVELOP_VERSION: boolean =
  $$DEVELOP_VERSION$$ === undefined ? true : $$DEVELOP_VERSION$$;

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
 * Imitation of 'templates' namespace.
 */
export const templates = {
  get svg(): RawElementConfig {
    return svg();
  },
};
