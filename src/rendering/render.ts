/**
 * @file
 *
 * DOM-rendering functions.
 */

import { DEVELOP_VERSION } from '../acg';
import ACGElement from '../elements/ACGElement';
import RenderState from '../enums/RenderState';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export const DATA_ACG_NAME = 'data-acgName';

/**
 * Creates DOM-Element as domRef and associates it to an ACGElement.
 *
 * @param el - ACGElement to be rendered.
 */
function renderDom(el: ACGElement): void {
  if (el.hasRenderState(RenderState.DOM)) {
    const domElement = <SVGElement>document.createElementNS(SVG_NS, el.tag);
    el.domRef = domElement;
    el.consistify(RenderState.DOM);
  }
}

/**
 * Renders ACGElement's attributes.
 *
 * @param el - ACGElement to get attributes info from.
 */
function renderAttrs(el: ACGElement): void {
  const { domRef, attrs, name } = el;

  /*
    Since el.domRef is nullable for disposing purposes,
    typescript tries to write the cycle's content as
      domRef?.removeAttribute(key);

    which compiles to something like 
      domRef === null || domRef === void 0 ? void 0 : domRef.removeAttribute(key);
    
    This check lingers for all the iterations. That's why
    we just move domRef existance to a single initial condition.
   */
  if (el.hasRenderState(RenderState.ATTRS) && domRef) {
    const { attributes } = <SVGElement>domRef;

    // Removing all attributes.
    Object.entries(attributes).forEach(([key]) => {
      domRef.removeAttribute(key);
    });

    // Adding new ones.
    Object.entries(attrs).forEach(([key, value]) => {
      domRef.setAttribute(key, String(value));
    });

    domRef.setAttribute(DATA_ACG_NAME, name);

    el.consistify(RenderState.ATTRS);
  }
}

/**
 * Renders ACGElement's content.
 *
 * @param el - ACGElement to render content to.
 */
function renderContent(el: ACGElement): void {
  const { domRef, content, sort, name, stage } = el;

  /*
    Since el.domRef is nullable for disposing purposes,
    typescript tries to write the cycle's content as
      domRef?.appendChild(<SVGElement>childEl.domRef);

    which compiles to something like 
      domRef === null || domRef === void 0 ? void 0 : domRef.appendChild(childEl.domRef);
    
    This check lingers for all the iterations. That's why
    we just move domRef existance to a single initial condition.
   */
  if (el.hasRenderState(RenderState.CONTENT) && domRef) {
    (<SVGElement>domRef).textContent = ''; // Clearing all content.

    if (Array.isArray(content)) {
      if (DEVELOP_VERSION && content.length > 50) {
        // TODO Hardcoded "50" value?
        console.warn(
          `Element "${name}" has more than 50 children. It can cause the noticeable performance bottleneck. Please, reorganize your SVG structure.`,
        );
      }

      // TODO Move it to the separated RenderState.
      if (sort) {
        content.sort(<SortingFunction<RawElementConfig>>sort);
      }

      content.forEach((childConfig) => {
        const childEl = <ACGElement>stage.find(childConfig.name); // By idea, can't be undefined.
        render(childEl);
        domRef.appendChild(<SVGElement>childEl.domRef);
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
