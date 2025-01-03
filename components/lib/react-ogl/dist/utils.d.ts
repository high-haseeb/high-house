import * as React from 'react';
import * as OGL from 'ogl';
import type { Fiber } from 'react-reconciler';
import { ConstructorRepresentation, DPR, EventHandlers, Instance, RootState, RootStore } from './types';
/**
 * Converts camelCase primitives to PascalCase.
 */
export declare const toPascalCase: (str: string) => string;
/**
 * Checks for inheritance between two classes.
 */
export declare const classExtends: (a: any, b: any) => boolean;
/**
 * Interpolates DPR from [min, max] based on device capabilities.
 */
export declare const calculateDpr: (dpr: DPR) => number;
/**
 * Returns only instance props from reconciler fibers.
 */
export declare function getInstanceProps<T = any>(queue: Fiber['pendingProps']): Instance<T>['props'];
/**
 * Prepares an object, returning an instance descriptor.
 */
export declare function prepare<T>(target: T, root: RootStore, type: string, props: Instance<T>['props']): Instance<T>;
/**
 * Resolves a potentially pierced key type against an object.
 */
export declare function resolve(root: any, key: string): {
    root: any;
    key: string;
    target: any;
};
/**
 * Attaches an instance to a parent via its `attach` prop.
 */
export declare function attach(parent: Instance, child: Instance): void;
/**
 * Removes an instance from a parent via its `attach` prop.
 */
export declare function detach(parent: Instance, child: Instance): void;
/**
 * Safely mutates an OGL element, respecting special JSX syntax.
 */
export declare function applyProps<T extends ConstructorRepresentation = any>(object: Instance<T>['object'], newProps: Instance<T>['props'], oldProps?: Instance<T>['props']): void;
/**
 * Creates event handlers, returning an event handler method.
 */
export declare function createEvents(state: RootState): {
    handleEvent: (event: PointerEvent, type: keyof EventHandlers) => OGL.Mesh<OGL.Geometry, OGL.Program>[];
};
export declare type SetBlock = false | Promise<null> | null;
/**
 * Used to block rendering via its `set` prop. Useful for suspenseful effects.
 */
export declare function Block({ set }: {
    set: React.Dispatch<React.SetStateAction<SetBlock>>;
}): null;
/**
 * Generic error boundary. Calls its `set` prop on error.
 */
export declare class ErrorBoundary extends React.Component<{
    set: React.Dispatch<any>;
    children: React.ReactNode;
}, {
    error: boolean;
}> {
    state: {
        error: boolean;
    };
    static getDerivedStateFromError: () => {
        error: boolean;
    };
    componentDidCatch(error: any): void;
    render(): React.ReactNode;
}
