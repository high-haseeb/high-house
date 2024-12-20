var _a;
import Reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants.js";
import { unstable_scheduleCallback, unstable_IdlePriority } from "scheduler";
import * as OGL from "ogl";
import * as React from "react";
import { toPascalCase, classExtends, applyProps, attach, prepare, detach } from "./utils.mjs";
import { RESERVED_PROPS } from "./constants.mjs";
const catalogue = { ...OGL };
const catalogueGL = [
  OGL.Camera,
  OGL.Geometry,
  OGL.Mesh,
  OGL.Program,
  OGL.RenderTarget,
  OGL.Texture,
  OGL.Flowmap,
  OGL.GPGPU,
  OGL.NormalProgram,
  OGL.Polyline,
  OGL.Post,
  OGL.Shadow,
  OGL.AxesHelper,
  OGL.GridHelper,
  OGL.WireMesh
];
function extend(objects, gl = false) {
  for (const key in objects) {
    const value = objects[key];
    catalogue[key] = value;
    if (gl)
      catalogueGL.push(value);
  }
}
function handleContainerEffects(parent, child) {
  var _a2;
  const state = child.root.getState();
  if (!parent.parent && parent.object !== state.scene)
    return;
  if (child.type !== "primitive") {
    const name = toPascalCase(child.type);
    const target = catalogue[name];
    const { args = [], ...props } = child.props;
    const isGLInstance = Object.values(catalogueGL).some((elem) => classExtends(elem, target));
    if (isGLInstance) {
      const { gl } = child.root.getState();
      const filtered = args.filter((arg) => arg !== gl);
      if (child.type === "program" || child.type === "geometry") {
        const attrs = Object.entries(props).reduce((acc, [key, value]) => {
          if (child.type === "geometry" && !(value == null ? void 0 : value.data))
            return acc;
          if (!key.includes("-"))
            acc[key] = value;
          return acc;
        }, (_a2 = filtered[0]) != null ? _a2 : {});
        child.object = new target(gl, attrs);
      } else {
        child.object = new target(gl, ...filtered);
      }
    } else {
      child.object = new target(...args);
    }
  }
  child.object.__ogl = child;
  if (!child.props.attach) {
    if (child.object instanceof OGL.Geometry)
      child.props.attach = "geometry";
    else if (child.object instanceof OGL.Program)
      child.props.attach = "program";
  }
  applyProps(child.object, child.props);
  if (child.props.attach) {
    attach(parent, child);
  } else if (child.object instanceof OGL.Transform && parent.object instanceof OGL.Transform) {
    child.object.setParent(parent.object);
  }
  for (const childInstance of child.children)
    handleContainerEffects(child, childInstance);
}
function createInstance(type, props, root) {
  const name = toPascalCase(type);
  const target = catalogue[name];
  if (type !== "primitive" && !target)
    throw `${type} is not a part of the OGL catalogue! Did you forget to extend?`;
  if (type === "primitive" && !props.object)
    throw `"object" must be set when using primitives.`;
  const instance = prepare(props.object, root, type, props);
  return instance;
}
const appendChild = (parent, child) => {
  child.parent = parent;
  parent.children.push(child);
  handleContainerEffects(parent, child);
};
function removeChild(parent, child, dispose, recursive) {
  child.parent = null;
  if (recursive === void 0) {
    const childIndex = parent.children.indexOf(child);
    if (childIndex !== -1)
      parent.children.splice(childIndex, 1);
  }
  if (child.props.attach) {
    detach(parent, child);
  } else if (parent.object instanceof OGL.Transform && child.object instanceof OGL.Transform) {
    parent.object.removeChild(child.object);
  }
  const shouldDispose = child.props.dispose !== null && dispose !== false;
  if (recursive !== false) {
    for (const node of child.children)
      removeChild(child, node, shouldDispose, true);
    child.children = [];
  }
  if (shouldDispose) {
    const object = child.object;
    unstable_scheduleCallback(unstable_IdlePriority, () => {
      var _a2;
      return (_a2 = object.dispose) == null ? void 0 : _a2.call(object);
    });
    delete child.object.__ogl;
    child.object = null;
  }
}
function insertBefore(parent, child, beforeChild, replace = false) {
  if (!child)
    return;
  child.parent = parent;
  const childIndex = parent.children.indexOf(beforeChild);
  if (childIndex !== -1)
    parent.children.splice(childIndex, replace ? 1 : 0, child);
  if (replace)
    beforeChild.parent = null;
  handleContainerEffects(parent, child);
}
function switchInstance(oldInstance, type, props, fiber) {
  const newInstance = createInstance(type, props, oldInstance.root);
  for (const child of oldInstance.children) {
    removeChild(oldInstance, child, false, false);
    appendChild(newInstance, child);
  }
  oldInstance.children = [];
  const parent = oldInstance.parent;
  if (parent) {
    insertBefore(parent, newInstance, oldInstance, true);
  }
  ;
  [fiber, fiber.alternate].forEach((fiber2) => {
    if (fiber2 !== null) {
      fiber2.stateNode = newInstance;
      if (fiber2.ref) {
        if (typeof fiber2.ref === "function")
          fiber2.ref(newInstance.object);
        else
          fiber2.ref.current = newInstance.object;
      }
    }
  });
  return newInstance;
}
function checkShallow(a, b) {
  if (Array.isArray(a)) {
    if (!Array.isArray(b))
      return false;
    if (a == b)
      return true;
    if (a.every((v, i) => v === b[i]))
      return true;
  }
  if (a === b)
    return true;
  return false;
}
function diffProps(instance, newProps, oldProps) {
  const changedProps = {};
  for (const key in newProps) {
    if (RESERVED_PROPS.includes(key))
      continue;
    if (instance.type === "primitive" && key === "object")
      continue;
    if (checkShallow(newProps[key], oldProps[key]))
      continue;
    changedProps[key] = newProps[key];
  }
  return changedProps;
}
const reconciler = Reconciler({
  isPrimaryRenderer: false,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  scheduleTimeout: () => typeof setTimeout !== "undefined" ? setTimeout : void 0,
  cancelTimeout: () => typeof clearTimeout !== "undefined" ? clearTimeout : void 0,
  noTimeout: -1,
  shouldSetTextContent: () => false,
  resetTextContent: () => {
  },
  createTextInstance() {
    throw new Error("Text is not allowed in the OGL scene-graph!");
  },
  hideTextInstance() {
    throw new Error("Text is not allowed in the OGL scene-graph!");
  },
  unhideTextInstance: () => {
  },
  getPublicInstance: (instance) => instance.object,
  getRootHostContext: () => null,
  getChildHostContext: (parentHostContext) => parentHostContext,
  preparePortalMount: (container) => prepare(container.getState().scene, container, "", {}),
  prepareForCommit: () => null,
  resetAfterCommit: () => {
  },
  clearContainer: () => false,
  createInstance,
  appendChild,
  appendInitialChild: appendChild,
  appendChildToContainer(container, child) {
    const scene = container.getState().scene.__ogl;
    if (!child || !scene)
      return;
    appendChild(scene, child);
  },
  insertBefore,
  insertInContainerBefore(container, child, beforeChild) {
    const scene = container.getState().scene.__ogl;
    if (!child || !beforeChild || !scene)
      return;
    insertBefore(scene, child, beforeChild);
  },
  removeChild,
  removeChildFromContainer(container, child) {
    const scene = container.getState().scene.__ogl;
    if (!child || !scene)
      return;
    removeChild(scene, child);
  },
  prepareUpdate(instance, type, oldProps, newProps) {
    var _a2, _b, _c, _d, _e;
    if (instance.type === "primitive" && oldProps.object !== newProps.object)
      return [true];
    if (type === "program") {
      if (oldProps.vertex !== newProps.vertex)
        return [true];
      if (oldProps.fragment !== newProps.fragment)
        return [true];
    }
    if (type === "geometry") {
      for (const key in oldProps) {
        const isAttribute = ((_a2 = oldProps[key]) == null ? void 0 : _a2.data) || ((_b = newProps[key]) == null ? void 0 : _b.data);
        if (isAttribute && oldProps[key] !== newProps[key])
          return [true];
      }
    }
    if (((_c = newProps.args) == null ? void 0 : _c.length) !== ((_d = oldProps.args) == null ? void 0 : _d.length))
      return [true];
    if ((_e = newProps.args) == null ? void 0 : _e.some((value, index) => {
      var _a3;
      return value !== ((_a3 = oldProps.args) == null ? void 0 : _a3[index]);
    }))
      return [true];
    const changedProps = diffProps(instance, newProps, oldProps);
    if (Object.keys(changedProps).length)
      return [false, changedProps];
    return null;
  },
  commitUpdate(instance, payload, type, oldProps, newProps, root) {
    const [reconstruct, changedProps] = payload;
    if (reconstruct)
      return switchInstance(instance, type, newProps, root);
    if (changedProps == null ? void 0 : changedProps.attach) {
      if (oldProps.attach)
        detach(instance.parent, instance);
      instance.props.attach = newProps.attach;
      if (newProps.attach)
        attach(instance.parent, instance);
    }
    Object.assign(instance.props, changedProps);
    applyProps(instance.object, changedProps);
  },
  hideInstance(instance) {
    if (instance.object instanceof OGL.Transform) {
      instance.object.visible = false;
    }
    instance.isHidden = true;
  },
  unhideInstance(instance) {
    if (instance.isHidden && instance.object instanceof OGL.Transform && instance.props.visible !== false) {
      instance.object.visible = true;
    }
    instance.isHidden = false;
  },
  finalizeInitialChildren: () => false,
  commitMount() {
  },
  getCurrentEventPriority: () => DefaultEventPriority,
  beforeActiveInstanceBlur: () => {
  },
  afterActiveInstanceBlur: () => {
  },
  detachDeletedInstance: () => {
  }
});
const act = React.act;
const isProd = typeof process === "undefined" || ((_a = process.env) == null ? void 0 : _a["NODE_ENV"]) === "production";
reconciler.injectIntoDevTools({
  findFiberByHostInstance: () => null,
  bundleType: isProd ? 0 : 1,
  version: React.version,
  rendererPackageName: "react-ogl"
});
export {
  act,
  extend,
  reconciler
};
//# sourceMappingURL=reconciler.mjs.map
