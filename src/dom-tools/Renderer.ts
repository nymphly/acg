import ACGElement from '../ACGElement';

export default class Renderer {
  static render(el: ACGElement): void {
    console.log(`RENDER: ${el.name}`);
  }
}
