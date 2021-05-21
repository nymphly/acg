enum RenderState {
  NONE = 0,
  DOM = 1 << 0,
  ATTRS = 1 << 1,
  SORT = 1 << 2,
  CONTENT = 1 << 3,
  ALL = 0xffffffff,
}

export default RenderState;
