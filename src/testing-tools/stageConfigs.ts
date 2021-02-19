export const twoLinesConfig: RawElementConfig = {
  tag: 'svg',
  name: 'Svg',
  attrs: {
    xmlns: 'http://www.w3.org/2000/svg',
    border: 0,
    width: '100%',
    height: '100%',
    class: 'anychart-ui-support',
    style: 'display: block',
  },
  // events: {
  //     onmousemove: (e) => console.log(e.target),
  //     'onclick:once': (e) => console.log(e.target) // once-command is listenOnce('click').
  // },
  content: [
    {
      tag: 'defs',
      name: 'Defs',
      content: [
        {
          tag: 'linearGradient',
          name: 'Black-To-White',
          attrs: {
            'id:uid': '', // TODO uid command generates UID, ignores '' value.
            x1: 0,
            y1: 0.5,
            x2: 1,
            y2: 0.5,
            gradientUnits: 'objectBoundingBox',
          },
          content: [
            {
              tag: 'stop',
              name: 'First-Stop',
              attrs: {
                offset: 0,
                style: 'stop-color:#ffffff; stop-opacity:1',
              },
            },

            {
              tag: 'stop',
              name: 'Second-Stop',
              attrs: {
                offset: 1,
                style: 'stop-color:#000000; stop-opacity:1',
              },
            },
          ],
        },
      ],
    },

    {
      tag: 'g',
      name: 'Root',
      content: [
        {
          tag: 'g',
          name: 'Lines-Layer',
          content: [
            {
              tag: 'path',
              name: 'Red-Path',
              attrs: {
                fill: 'none',
                stroke: '#f00',
                'stroke-opacity': 0.47,
                d: 'M 1024 175 A 151 151 0 0 1 722 175.00000000000003 Z',
              },
            },
            {
              tag: 'path',
              name: 'Green-Path',
              attrs: {
                fill: 'none',
                stroke: '#0f0',
                'stroke-opacity': 0.5,
                d: 'M 0 0 L 100 100',
              },
            },
          ],
        },
      ],
    },
  ],
};
