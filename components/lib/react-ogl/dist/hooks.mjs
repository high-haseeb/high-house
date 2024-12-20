var _a, _b;
import * as React from "react";
import * as OGL from "ogl";
import { suspend } from "suspend-react";
import { classExtends } from "./utils.mjs";
const useIsomorphicLayoutEffect = typeof window !== "undefined" && (((_a = window.document) == null ? void 0 : _a.createElement) || ((_b = window.navigator) == null ? void 0 : _b.product) === "ReactNative") ? React.useLayoutEffect : React.useEffect;
function useInstanceHandle(ref) {
  const instance = React.useRef(null);
  useIsomorphicLayoutEffect(
    () => void (instance.current = ref.current.__ogl),
    [ref]
  );
  return instance;
}
const OGLContext = React.createContext(null);
function useStore() {
  const store = React.useContext(OGLContext);
  if (!store)
    throw `react-ogl hooks can only used inside a canvas or OGLContext provider!`;
  return store;
}
function useOGL(selector = (state) => state, equalityFn) {
  return useStore()(selector, equalityFn);
}
function useGraph(object) {
  return React.useMemo(() => {
    const data = { nodes: {}, programs: {} };
    object.traverse((obj) => {
      if (!(obj instanceof OGL.Mesh))
        return;
      if (obj.name)
        data.nodes[obj.name] = obj;
      if (obj.program.gltfMaterial && !data.programs[obj.program.gltfMaterial.name]) {
        data.programs[obj.program.gltfMaterial.name] = obj.program;
      }
    });
    return data;
  }, [object]);
}
function useFrame(callback, renderPriority = 0) {
  const subscribe = useOGL((state) => state.subscribe);
  const unsubscribe = useOGL((state) => state.unsubscribe);
  const ref = React.useRef(callback);
  useIsomorphicLayoutEffect(() => void (ref.current = callback), [callback]);
  useIsomorphicLayoutEffect(() => {
    subscribe(ref, renderPriority);
    return () => void unsubscribe(ref, renderPriority);
  }, [subscribe, unsubscribe, renderPriority]);
}
function useLoader(loader, input, extensions) {
  const gl = useOGL((state) => state.gl);
  const keys = Array.isArray(input) ? input : [input];
  return suspend(
    async (gl2, loader2, ...urls) => {
      extensions == null ? void 0 : extensions(loader2);
      const result = await Promise.all(
        urls.map(async (url) => {
          if (classExtends(loader2, OGL.TextureLoader))
            return loader2.load(gl2, { src: url });
          return await loader2.load(gl2, url);
        })
      );
      return Array.isArray(input) ? result : result[0];
    },
    [gl, loader, ...keys]
  );
}
export {
  OGLContext,
  useFrame,
  useGraph,
  useInstanceHandle,
  useIsomorphicLayoutEffect,
  useLoader,
  useOGL,
  useStore
};
//# sourceMappingURL=hooks.mjs.map
