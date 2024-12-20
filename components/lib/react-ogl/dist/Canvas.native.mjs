import * as React from "react";
import { PixelRatio, View, StyleSheet } from "react-native";
import { GLView } from "expo-gl";
import { useContextBridge, FiberProvider } from "its-fine";
import { ErrorBoundary, Block } from "./utils.mjs";
import { events } from "./events.native.mjs";
import { render, unmountComponentAtNode } from "./renderer.mjs";
const CanvasImpl = React.forwardRef(function Canvas2({ children, style, renderer, camera, orthographic, frameloop, events: events$1 = events, onCreated, ...props }, forwardedRef) {
  const Bridge = useContextBridge();
  const [{ width, height }, setSize] = React.useState({ width: 0, height: 0 });
  const [canvas, setCanvas] = React.useState(null);
  const [bind, setBind] = React.useState();
  const [block, setBlock] = React.useState(false);
  const [error, setError] = React.useState(false);
  if (block)
    throw block;
  if (error)
    throw error;
  const onLayout = React.useCallback((e) => {
    const { width: width2, height: height2 } = e.nativeEvent.layout;
    setSize({ width: width2, height: height2 });
  }, []);
  const onContextCreate = React.useCallback((context) => {
    const canvasShim = {
      width: context.drawingBufferWidth,
      height: context.drawingBufferHeight,
      style: {},
      addEventListener: () => {
      },
      removeEventListener: () => {
      },
      clientHeight: context.drawingBufferHeight,
      getContext: () => context
    };
    context.canvas = canvasShim;
    setCanvas(canvasShim);
  }, []);
  if (canvas && width > 0 && height > 0) {
    render(
      /* @__PURE__ */ React.createElement(Bridge, null, /* @__PURE__ */ React.createElement(ErrorBoundary, {
        set: setError
      }, /* @__PURE__ */ React.createElement(React.Suspense, {
        fallback: /* @__PURE__ */ React.createElement(Block, {
          set: setBlock
        })
      }, children))),
      canvas,
      {
        size: { width, height },
        orthographic,
        frameloop,
        renderer,
        dpr: PixelRatio.get(),
        camera,
        events: events$1,
        onCreated(state) {
          var _a, _b;
          const gl = state.gl;
          if ("endFrameEXP" in gl) {
            const renderFrame = state.renderer.render.bind(state.renderer);
            state.renderer.render = (...args) => {
              renderFrame(...args);
              gl.endFrameEXP();
            };
          }
          setBind((_b = (_a = state.events) == null ? void 0 : _a.connected) == null ? void 0 : _b.getEventHandlers());
          return onCreated == null ? void 0 : onCreated(state);
        }
      }
    );
  }
  React.useEffect(() => {
    if (canvas) {
      return () => unmountComponentAtNode(canvas);
    }
  }, [canvas]);
  return /* @__PURE__ */ React.createElement(View, {
    ...props,
    ref: forwardedRef,
    onLayout,
    style: { flex: 1, ...style },
    ...bind
  }, width > 0 && /* @__PURE__ */ React.createElement(GLView, {
    onContextCreate,
    style: StyleSheet.absoluteFill
  }));
});
const Canvas = React.forwardRef(function CanvasWrapper(props, ref) {
  return /* @__PURE__ */ React.createElement(FiberProvider, null, /* @__PURE__ */ React.createElement(CanvasImpl, {
    ...props,
    ref
  }));
});
export {
  Canvas
};
//# sourceMappingURL=Canvas.native.mjs.map
