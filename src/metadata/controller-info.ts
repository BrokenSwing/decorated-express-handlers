import 'reflect-metadata';
import {Router} from 'express';

/**
 * The metadata key for the controller information.
 */
export const CONTROLLER_INFO_METADATA = Symbol('controllerInfo');

/**
 * Information about a controller.
 * Attributes:
 *  - path: The path to mount the router on
 *  - router: The router to mount request handlers on
 */
export interface ControllerInfo {
    path: string;
    router: Router;
}

/**
 * Defines the controller information for a class.
 *
 * @param target The target class
 * @param info The information to set
 */
export function setControllerInfo(target: Record<string, any>, info: ControllerInfo[]): void {
    Reflect.defineMetadata(CONTROLLER_INFO_METADATA, info, target);
}

/**
 * Retrieves the controller information for a class.
 * If no information is found, an empty array is returned.
 *
 * @param target The target class
 */
export function getControllerInfoOf(target: Record<string, any>): ControllerInfo[] {
    return Reflect.getOwnMetadata(CONTROLLER_INFO_METADATA, target) || [];
}

/**
 * Adds a controller information for a class.
 *
 * @param target The target class
 * @param info The information to add
 */
export function addControllerInfoFor(target: Record<string, any>, info: ControllerInfo): void {
    const controllerInfo = getControllerInfoOf(target);
    controllerInfo.push(info);
    setControllerInfo(target, controllerInfo);
}

/**
 * Checks if the given class is a controller. A class is a controller
 * if a controller information is attached to it.
 *
 * @param target The target class
 */
export function isController(target: Record<string, any>): boolean {
    return getControllerInfoOf(target).length > 0;
}
