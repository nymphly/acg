/**
 * @file
 *
 * Stage test.
 */

/// <reference types="./../../typings/global" />

import { expect } from 'chai';
import { twoLinesConfig } from '../testing-tools/stageConfigs';
import { recursiveClone } from '../utils/object';
import Stage from './Stage';

describe('#Stage init', function () {
  it('should correctly parse to stage.#rawConfigs', () => {
    const config: RawElementConfig = <RawElementConfig>recursiveClone(twoLinesConfig);
    const stage: Stage = new Stage(config);

    const { rawConfigs } = stage;
    expect(rawConfigs).to.have.length(9);

    expect(rawConfigs).to.have.all.keys(
      'Svg',
      'Defs',
      'Black-To-White',
      'First-Stop',
      'Second-Stop',
      'Root',
      'Lines-Layer',
      'Red-Path',
      'Green-Path',
    );
  });

  it('should correctly parse to stage.#parents', () => {
    const config: RawElementConfig = <RawElementConfig>recursiveClone(twoLinesConfig);
    const stage: Stage = new Stage(config);

    const { parents } = stage;
    expect(parents).to.have.length(9);

    expect(parents).to.have.all.keys(
      'Svg',
      'Defs',
      'Black-To-White',
      'First-Stop',
      'Second-Stop',
      'Root',
      'Lines-Layer',
      'Red-Path',
      'Green-Path',
    );

    expect(parents.get('Svg')).to.equal(null);
    expect(parents.get('Defs')).to.equal('Svg');
    expect(parents.get('Black-To-White')).to.equal('Defs');
    expect(parents.get('First-Stop')).to.equal('Black-To-White');
    expect(parents.get('Second-Stop')).to.equal('Black-To-White');
    expect(parents.get('Root')).to.equal('Svg');
    expect(parents.get('Lines-Layer')).to.equal('Root');
    expect(parents.get('Red-Path')).to.equal('Lines-Layer');
    expect(parents.get('Green-Path')).to.equal('Lines-Layer');
  });
});
