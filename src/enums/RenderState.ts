enum RenderState {
  NONE = 0,
  DOM = 1 << 0,
  ATTRS = 1 << 1,
  CONTENT = 1 << 2,
  ALL = 0xffffffff,
}

export default RenderState;
