/**
 * @file
 *
 * DOM-rendering functions.
 */

import { ACGElement } from '../elements';
import { RenderState } from '../enums';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export const DATA_ACG_NAME = 'data-acgName';

/**
 * @param el
 */
function renderDom(el: ACGElement): void {
  if (el.hasRenderState(RenderState.DOM)) {
    const domElement = <SVGElement>document.createElementNS(SVG_NS, el.tag);
    el.domRef = domElement;
    el.consistify(RenderState.DOM);
  }
}

/**
 * @param el
 */
function renderAttrs(el: ACGElement): void {
  if (el.hasRenderState(RenderState.ATTRS)) {
    const { domRef, attrs, name } = el;
    const { attributes } = <SVGElement>domRef;

    // Removing all attributes.
    Object.entries(attributes).forEach(([key]) => {
      domRef?.removeAttribute(key);
    });

    // Adding new ones.
    Object.entries(attrs).forEach(([key, value]) => {
      domRef?.setAttribute(key, String(value));
    });

    domRef?.setAttribute(DATA_ACG_NAME, name);

    el.consistify(RenderState.ATTRS);
  }
}

/**
 * @param el
 */
function renderContent(el: ACGElement): void {
  if (el.hasRenderState(RenderState.CONTENT)) {
    const { domRef, content, sort, name, stage } = el;
    (<SVGElement>domRef).textContent = ''; // Clearing all content.

    if (Array.isArray(content)) {
      if ($$DEVELOP_VERSION$$ && content.length > 50) {
        // TODO Hardcoded "50" value?
        console.warn(
          `Element "${name}" has more than 50 children. It can cause the noticeable performance bottleneck. Please, reorganize your SVG structure.`,
        );
      }

      if (sort) {
        content.sort(<SortingFunction<RawElementConfig>>sort);
      }

      content.forEach((childConfig) => {
        const childEl = <ACGElement>stage.find(childConfig.name); // By idea, can't be undefined.
        render(childEl);
        domRef?.appendChild(<SVGElement>childEl.domRef);
      });
    } else {
      (<SVGElement>domRef).textContent = String(content);
    }

    el.consistify(RenderState.CONTENT);
  }
}

/**
 * Default ACGElement renderer.
 * 
 * @param el - Element to be rendered.
 */
export default function render(el: ACGElement): void {
  if (!el.isDisposed) {
    renderDom(el);
    renderAttrs(el);
    renderContent(el);
  }
}
