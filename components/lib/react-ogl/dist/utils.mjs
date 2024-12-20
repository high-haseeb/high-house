import * as React from "react";
import * as OGL from "ogl";
import { RESERVED_PROPS, INSTANCE_PROPS, POINTER_EVENTS } from "./constants.mjs";
import { useIsomorphicLayoutEffect } from "./hooks.mjs";
const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.substring(1);
const classExtends = (a, b) => Object.prototype.isPrototypeOf.call(a, b) || a === b;
const calculateDpr = (dpr) => Array.isArray(dpr) ? Math.min(Math.max(dpr[0], window.devicePixelRatio), dpr[1]) : dpr;
function getInstanceProps(queue) {
  const props = {};
  for (const key in queue) {
    if (!RESERVED_PROPS.includes(key))
      props[key] = queue[key];
  }
  return props;
}
function prepare(target, root, type, props) {
  const object = target != null ? target : {};
  let instance = object.__ogl;
  if (!instance) {
    instance = {
      root,
      parent: null,
      children: [],
      type,
      props: getInstanceProps(props),
      object,
      isHidden: false
    };
    object.__ogl = instance;
  }
  return instance;
}
function resolve(root, key) {
  let target = root[key];
  if (!key.includes("-"))
    return { root, key, target };
  const chain = key.split("-");
  target = chain.reduce((acc, key2) => acc[key2], root);
  key = chain.pop();
  if (!(target == null ? void 0 : target.set))
    root = chain.reduce((acc, key2) => acc[key2], root);
  return { root, key, target };
}
const INDEX_REGEX = /-\d+$/;
function attach(parent, child) {
  if (typeof child.props.attach === "string") {
    if (INDEX_REGEX.test(child.props.attach)) {
      const target = child.props.attach.replace(INDEX_REGEX, "");
      const { root: root2, key: key2 } = resolve(parent.object, target);
      if (!Array.isArray(root2[key2]))
        root2[key2] = [];
    }
    const { root, key } = resolve(parent.object, child.props.attach);
    child.object.__previousAttach = root[key];
    root[key] = child.object;
    child.object.__currentAttach = parent.object.__currentAttach = root[key];
  } else if (typeof child.props.attach === "function") {
    child.object.__previousAttach = child.props.attach(parent.object, child.object);
  }
}
function detach(parent, child) {
  if (typeof child.props.attach === "string") {
    if (parent.object.__currentAttach === child.object.__currentAttach) {
      const { root, key } = resolve(parent.object, child.props.attach);
      root[key] = child.object.__previousAttach;
    }
  } else {
    child.object.__previousAttach(parent.object, child.object);
  }
  delete child.object.__previousAttach;
  delete child.object.__currentAttach;
  delete parent.object.__currentAttach;
}
function applyProps(object, newProps, oldProps) {
  var _a, _b;
  for (const prop in newProps) {
    if (RESERVED_PROPS.includes(prop))
      continue;
    if (INSTANCE_PROPS.includes(prop))
      continue;
    if (newProps[prop] === (oldProps == null ? void 0 : oldProps[prop]))
      continue;
    const isHandler = POINTER_EVENTS.includes(prop);
    if (isHandler) {
      object.__handlers = { ...object.__handlers, [prop]: newProps[prop] };
      continue;
    }
    const value = newProps[prop];
    const { root, key, target } = resolve(object, prop);
    const isMathClass = typeof (target == null ? void 0 : target.set) === "function" && typeof (target == null ? void 0 : target.copy) === "function";
    if (!ArrayBuffer.isView(value) && isMathClass) {
      if (target.constructor === value.constructor) {
        target.copy(value);
      } else if (Array.isArray(value)) {
        target.set(...value);
      } else {
        const scalar = new Array(target.length).fill(value);
        target.set(...scalar);
      }
    } else {
      const uniformList = value;
      if (key === "uniforms") {
        for (const uniform in uniformList) {
          let uniformValue = (_b = (_a = uniformList[uniform]) == null ? void 0 : _a.value) != null ? _b : uniformList[uniform];
          if (typeof uniformValue === "string") {
            uniformValue = new OGL.Color(uniformValue);
          } else if ((uniformValue == null ? void 0 : uniformValue.constructor) === Array && uniformValue.every((v) => typeof v === "number")) {
            uniformValue = new OGL[`Vec${uniformValue.length}`](...uniformValue);
          }
          root.uniforms[uniform] = { value: uniformValue };
        }
      } else {
        root[key] = value;
      }
    }
  }
}
function createEvents(state) {
  const handleEvent = (event, type) => {
    var _a, _b, _c;
    state.mouse.x = event.offsetX / state.size.width * 2 - 1;
    state.mouse.y = -(event.offsetY / state.size.height) * 2 + 1;
    const interactive = [];
    state.scene.traverse((node) => {
      var _a2, _b2;
      if (node instanceof OGL.Mesh && node.__handlers && ((_b2 = (_a2 = node.geometry) == null ? void 0 : _a2.attributes) == null ? void 0 : _b2.position))
        interactive.push(node);
    });
    state.raycaster.castMouse(state.camera, state.mouse);
    const intersects = state.raycaster.intersectMeshes(interactive);
    const isHoverEvent = type === "onPointerMove";
    for (const entry of intersects) {
      if (!entry.__handlers)
        continue;
      const object = entry;
      const handlers = object.__handlers;
      if (isHoverEvent && !state.hovered.get(object.id)) {
        state.hovered.set(object.id, object);
        (_a = handlers.onPointerMove) == null ? void 0 : _a.call(handlers, { ...object.hit, nativeEvent: event });
        (_b = handlers.onPointerOver) == null ? void 0 : _b.call(handlers, { ...object.hit, nativeEvent: event });
      } else {
        (_c = handlers[type]) == null ? void 0 : _c.call(handlers, { ...object.hit, nativeEvent: event });
      }
    }
    if (isHoverEvent || type === "onPointerDown") {
      state.hovered.forEach((object) => {
        const handlers = object.__handlers;
        if (!intersects.length || !intersects.find((i) => i === object)) {
          state.hovered.delete(object.id);
          if (handlers == null ? void 0 : handlers.onPointerOut)
            handlers.onPointerOut({ ...object.hit, nativeEvent: event });
        }
      });
    }
    return intersects;
  };
  return { handleEvent };
}
function Block({ set }) {
  useIsomorphicLayoutEffect(() => {
    set(new Promise(() => null));
    return () => set(false);
  }, []);
  return null;
}
class ErrorBoundary extends React.Component {
  constructor() {
    super(...arguments);
    this.state = { error: false };
  }
  componentDidCatch(error) {
    this.props.set(error);
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}
ErrorBoundary.getDerivedStateFromError = () => ({ error: true });
export {
  Block,
  ErrorBoundary,
  applyProps,
  attach,
  calculateDpr,
  classExtends,
  createEvents,
  detach,
  getInstanceProps,
  prepare,
  resolve,
  toPascalCase
};
//# sourceMappingURL=utils.mjs.map
