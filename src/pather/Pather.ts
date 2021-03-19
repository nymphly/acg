/**
 * @file
 *
 * Simplifier function, allows to use construction like
 *  {code}
 *    const d = pather.moveTo(10, 10).lineTo(40, 40).get();
 *  {code}
 * to get resulting line like "M 10 10L 40 40" suitable
 * to be set as SVG path's d-attribute.
 *
 * NOTE: in current implementation uses absolute coordinates.
 *   Read more: https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths.
 */

import { ACGElement } from '../elements';

export default class Pather {
  #rv = '';

  //TODO Think of this shift!!! Do we need it? Do we use it correctly for curves?
  #shift = 0;

  public setShift(val: number): Pather {
    this.#shift = val;
    return this;
  }

  public moveTo(x: number, y: number): Pather {
    this.#rv = `${this.#rv}M ${x + this.#shift} ${y + this.#shift}`;
    return this;
  }

  public lineTo(x: number, y: number): Pather {
    this.#rv = `${this.#rv}L ${x + this.#shift} ${y + this.#shift}`;
    return this;
  }

  public h(x: number): Pather {
    this.#rv = `${this.#rv}H ${x + this.#shift}`;
    return this;
  }

  public v(y: number): Pather {
    this.#rv = `${this.#rv}V ${y + this.#shift}`;
    return this;
  }

  public curveTo(x1: number, y1: number, x2: number, y2: number, toX: number, toY: number): Pather {
    this.#rv = `${this.#rv}C ${x1 + this.#shift} ${y1 + this.#shift} ${x2 + this.#shift} ${
      y2 + this.#shift
    } ${toX + this.#shift} ${toY + this.#shift}`;
    return this;
  }

  public bezierCurveTo(x2: number, y2: number, toX: number, toY: number): Pather {
    this.#rv = `${this.#rv}S ${x2 + this.#shift} ${y2 + this.#shift} ${toX + this.#shift} ${
      toY + this.#shift
    }`;
    return this;
  }

  public squareBezierCurveTo(x2: number, y2: number, toX: number, toY: number): Pather {
    this.#rv = `${this.#rv}Q ${x2 + this.#shift} ${y2 + this.#shift} ${toX + this.#shift} ${
      toY + this.#shift
    }`;
    return this;
  }

  public arcTo(
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeArcFlag: number,
    sweepFlag: number,
    toX: number,
    toY: number,
  ): Pather {
    this.#rv = `${this.#rv}A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${
      toX + this.#shift
    } ${toY + this.#shift}`;
    return this;
  }

  public close(): Pather {
    this.#rv = `${this.#rv}Z`;
    return this;
  }

  public asRect(left: number, top: number, width: number, height: number): Pather {
    this.moveTo(left, top)
      .h(left + width)
      .v(top + height)
      .h(left)
      .close();
    return this;
  }

  public asCircle(cx: number, cy: number, radius: number): Pather {
    this.moveTo(cx + radius, cy)
      .arcTo(radius, radius, 0, 0, 1, cx - radius, cy)
      .arcTo(radius, radius, 0, 0, 1, cx + radius, cy);
    return this;
  }

  public get(): string {
    return this.#rv;
  }

  public clear(): Pather {
    this.#rv = '';
    return this;
  }

  public applyTo(path: ACGElement): Pather {
    path.attrs = {
      ...path.attrs,
      d: this.get(),
    };
    return this;
  }
}
