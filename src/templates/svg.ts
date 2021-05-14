import { SVG_NS } from '../rendering/render';

/**
 *
 */
function rootLayer() {
  return {
    tag: 'g',
    name: 'Root-Layer',
  };
}

/**
 *
 */
export default function svg() {
  return {
    tag: 'svg',
    name: 'Svg',
    attrs: {
      xmlns: SVG_NS,
      border: 0,
      width: '100%',
      height: '100%',
      class: 'acg-stage',
      style: 'display: block',
    },
    content: [rootLayer()],
  };
}
