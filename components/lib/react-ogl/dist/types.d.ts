/// <reference types="webxr" />
import type * as OGL from 'ogl';
import type * as React from 'react';
import type { UseBoundStore, StoreApi } from 'zustand';
declare type Mutable<P> = {
    [K in keyof P]: P[K] | Readonly<P[K]>;
};
declare type NonFunctionKeys<P> = {
    [K in keyof P]-?: P[K] extends Function ? never : K;
}[keyof P];
declare type Overwrite<P, O> = Omit<P, NonFunctionKeys<O>> & O;
declare type Filter<T, O> = T extends [] ? [] : T extends [infer H, ...infer R] ? H extends O ? Filter<R, O> : [H, ...Filter<R, O>] : T;
export interface OGLEvent<TEvent extends Event> extends Partial<OGL.RaycastHit> {
    nativeEvent: TEvent;
}
export interface EventHandlers {
    /** Fired when the mesh is clicked or tapped. */
    onClick?: (event: OGLEvent<MouseEvent>) => void;
    /** Fired when a pointer becomes inactive over the mesh. */
    onPointerUp?: (event: OGLEvent<PointerEvent>) => void;
    /** Fired when a pointer becomes active over the mesh. */
    onPointerDown?: (event: OGLEvent<PointerEvent>) => void;
    /** Fired when a pointer moves over the mesh. */
    onPointerMove?: (event: OGLEvent<PointerEvent>) => void;
    /** Fired when a pointer enters the mesh's bounds. */
    onPointerOver?: (event: OGLEvent<PointerEvent>) => void;
    /** Fired when a pointer leaves the mesh's bounds. */
    onPointerOut?: (event: OGLEvent<PointerEvent>) => void;
}
export interface XRManager {
    session: XRSession | null;
    setSession(session: XRSession | null): void;
    connect(session: XRSession): void;
    disconnect(): void;
}
export interface EventManager {
    connected: boolean;
    connect: (target: HTMLCanvasElement, state: RootState) => void;
    disconnect: (target: HTMLCanvasElement, state: RootState) => void;
    [name: string]: any;
}
export interface Size {
    width: number;
    height: number;
}
export declare type Frameloop = 'always' | 'never';
export declare type Subscription = (state: RootState, time: number, frame?: XRFrame) => any;
export interface RootState {
    set: StoreApi<RootState>['setState'];
    get: StoreApi<RootState>['getState'];
    size: Size;
    xr: XRManager;
    orthographic: boolean;
    frameloop: Frameloop;
    renderer: OGL.Renderer;
    gl: OGL.OGLRenderingContext;
    scene: OGL.Transform;
    camera: OGL.Camera;
    priority: number;
    subscribed: React.MutableRefObject<Subscription>[];
    subscribe: (refCallback: React.MutableRefObject<Subscription>, renderPriority?: number) => void;
    unsubscribe: (refCallback: React.MutableRefObject<Subscription>, renderPriority?: number) => void;
    events?: EventManager;
    mouse?: OGL.Vec2;
    raycaster?: OGL.Raycast;
    hovered?: Map<number, Instance<OGL.Mesh>['object']>;
    [key: string]: any;
}
export declare type Act = <T = any>(cb: () => Promise<T>) => Promise<T>;
export declare type RootStore = UseBoundStore<StoreApi<RootState>>;
export interface Root {
    render: (element: React.ReactNode) => RootStore;
    unmount: () => void;
}
export declare type DPR = [number, number] | number;
export interface RenderProps {
    size?: Size;
    orthographic?: boolean;
    frameloop?: Frameloop;
    renderer?: ((canvas: HTMLCanvasElement) => OGL.Renderer) | OGL.Renderer | OGLElement<typeof OGL.Renderer> | Partial<OGL.RendererOptions>;
    gl?: OGL.OGLRenderingContext;
    dpr?: DPR;
    camera?: OGL.Camera | OGLElement<typeof OGL.Camera> | Partial<OGL.CameraOptions>;
    scene?: OGL.Transform;
    events?: EventManager;
    onCreated?: (state: RootState) => any;
}
export declare type Attach<O = any> = string | ((parent: any, self: O) => () => void);
export declare type ConstructorRepresentation = new (...args: any[]) => any;
export interface Catalogue {
    [name: string]: ConstructorRepresentation;
}
export declare type Args<T> = T extends ConstructorRepresentation ? ConstructorParameters<T> : any[];
export interface InstanceProps<T = any> {
    args?: Filter<Args<T>, OGL.OGLRenderingContext>;
    object?: T;
    visible?: boolean;
    dispose?: null;
    attach?: Attach<T>;
}
export interface Instance<O = any> {
    root: RootStore;
    parent: Instance | null;
    children: Instance[];
    type: string;
    props: InstanceProps<O> & Record<string, unknown>;
    object: O & {
        __ogl?: Instance<O>;
        __handlers: Partial<EventHandlers>;
    };
    isHidden: boolean;
}
interface MathRepresentation {
    set(...args: any[]): any;
}
declare type MathProps<P> = {
    [K in keyof P]: P[K] extends infer M ? (M extends MathRepresentation ? M | Parameters<M['set']> | number : {}) : {};
};
declare type EventProps<P> = P extends OGL.Mesh ? Partial<EventHandlers> : {};
interface ReactProps<P> {
    children?: React.ReactNode;
    ref?: React.Ref<P>;
    key?: React.Key;
}
declare type OGLElementProps<T extends ConstructorRepresentation, P = InstanceType<T>> = Partial<Overwrite<P, ReactProps<P> & MathProps<P> & EventProps<P>>>;
export declare type OGLElement<T extends ConstructorRepresentation> = Mutable<Overwrite<OGLElementProps<T>, Omit<InstanceProps<InstanceType<T>>, 'object'>>>;
declare type OGLExports = typeof OGL;
declare type OGLElementsImpl = {
    [K in keyof OGLExports as Uncapitalize<K>]: OGLExports[K] extends ConstructorRepresentation ? OGLElement<OGLExports[K]> : never;
};
declare type ColorNames = 'black' | 'white' | 'red' | 'green' | 'blue' | 'fuchsia' | 'cyan' | 'yellow' | 'orange';
declare type UniformValue = ColorNames | number | number[] | OGL.Texture | OGL.Texture[];
declare type UniformRepresentation = UniformValue | {
    [structName: string]: UniformValue;
};
declare type UniformList = {
    [uniform: string]: UniformRepresentation | {
        value: UniformRepresentation;
    };
};
export interface OGLElements extends OGLElementsImpl {
    primitive: Omit<OGLElement<any>, 'args'> & {
        object: any;
    };
    program: Overwrite<OGLElement<typeof OGL.Program>, {
        vertex?: string;
        fragment?: string;
        uniforms?: UniformList;
    }>;
    geometry: OGLElement<typeof OGL.Geometry> & {
        [name: string]: Partial<Omit<OGL.Attribute, 'data'>> & Required<Pick<OGL.Attribute, 'data'>>;
    };
}
declare global {
    namespace JSX {
        interface IntrinsicElements extends OGLElements {
        }
    }
}
export {};
