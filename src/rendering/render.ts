import { ACGElement } from '../elements';
import { RenderState } from '../enums';

export const SVG_NS = 'http://www.w3.org/2000/svg';

export const ACG_ATTR_PREFIX = 'acg-';

function renderDom(el: ACGElement): void {
  if (el.hasRenderState(RenderState.DOM)) {
    const domElement = <SVGElement>document.createElementNS(SVG_NS, el.tag);
    el.domRef = domElement;
    el.consistify(RenderState.DOM);
  }
}

function renderAttrs(el: ACGElement): void {
  if (el.hasRenderState(RenderState.ATTRS)) {
    const { domRef } = el;
    const { attributes } = <SVGElement>domRef;

    // Removing all attributes.
    Object.entries(attributes).forEach(([key]) => {
      domRef?.removeAttribute(key);
    });

    // Adding new ones.
    Object.entries(el.attrs).forEach(([key, value]) => {
      domRef?.setAttribute(key, String(value));
    });

    domRef?.setAttribute(`${ACG_ATTR_PREFIX}name`, el.name);

    el.consistify(RenderState.ATTRS);
  }
}

function renderContent(el: ACGElement): void {
  if (el.hasRenderState(RenderState.CONTENT)) {
    const { domRef } = el;
    (<SVGElement>domRef).textContent = ''; // Clearing all content.

    if (Array.isArray(el.content)) {
      if (el.sort) {
        el.content.sort(<SortingFunction<RawElementConfig>>el.sort);
      }

      el.content.forEach((childConfig) => {
        const childEl = <ACGElement>el.stage.find(childConfig.name); // By idea, can't be undefined.
        render(childEl);
        domRef?.appendChild(<SVGElement>childEl.domRef);
      });
    } else {
      (<SVGElement>domRef).textContent = String(el.content);
    }

    el.consistify(RenderState.CONTENT);
  }
}

export default function render(el: ACGElement): void {
  renderDom(el);
  renderAttrs(el);
  renderContent(el);
}
