/**
 * @file
 *
 * Array tools tests.
 */

import { expect } from 'chai';
import { isArray } from './array';

describe('#array utils', function () {
  it('should correctly define whether value is array or not', () => {
    expect(isArray([])).to.be.true;
    expect(isArray({})).to.be.false;
    expect(isArray({ length: 10 })).to.be.false;
    expect(isArray(new Array(0))).to.be.true;
  });
});
