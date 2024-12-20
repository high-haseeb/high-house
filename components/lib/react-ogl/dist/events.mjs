import { createEvents } from "./utils.mjs";
const EVENTS = {
  click: ["onClick", false],
  pointerup: ["onPointerUp", true],
  pointerdown: ["onPointerDown", true],
  pointermove: ["onPointerMove", true]
};
const events = {
  connected: false,
  connect(canvas, state) {
    var _a, _b, _c;
    (_b = (_a = state.events).disconnect) == null ? void 0 : _b.call(_a, canvas, state);
    const { handleEvent } = createEvents(state);
    state.events.handlers = Object.entries(EVENTS).reduce(
      (acc, [name, [type]]) => ({
        ...acc,
        [name]: (event) => handleEvent(event, type)
      }),
      {}
    );
    for (const key in EVENTS) {
      const handler = (_c = state.events.handlers) == null ? void 0 : _c[key];
      if (handler) {
        const [, passive] = EVENTS[key];
        canvas.addEventListener(key, handler, { passive });
      }
    }
    state.events.connected = true;
  },
  disconnect(canvas, state) {
    var _a;
    for (const key in EVENTS) {
      const handler = (_a = state.events.handlers) == null ? void 0 : _a[key];
      if (handler) {
        canvas.removeEventListener(key, handler);
      }
    }
    state.events.connected = false;
  }
};
export {
  EVENTS,
  events
};
//# sourceMappingURL=events.mjs.map
