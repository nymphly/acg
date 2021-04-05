function rootLayer() {
  return {
    tag: 'g',
    name: 'Root-Layer',
  }
}


export default function svg() {
  return {
    tag: 'svg',
    name: 'Svg',
    attrs: {
      xmlns: 'http://www.w3.org/2000/svg',
      border: 0,
      width: '100%',
      height: '100%',
      class: 'acg-stage',
      style: 'display: block',
    },
    content: [
      rootLayer()
    ]
  }
}
