import Reconciler from 'react-reconciler';
import { Act, Catalogue, Instance, RootStore } from './types';
/**
 * Extends the OGL catalogue, accepting an object of keys pointing to external classes.
 * `gl` will flag `objects` to receive a `WebGLRenderingContext` on creation.
 */
export declare function extend(objects: Partial<Catalogue>, gl?: boolean): void;
/**
 * Centralizes and handles mutations through an OGL scene-graph.
 */
export declare const reconciler: Reconciler.Reconciler<RootStore, Instance<any>, never, Instance<any>, any>;
/**
 * Safely flush async effects when testing, simulating a legacy root.
 */
export declare const act: Act;
