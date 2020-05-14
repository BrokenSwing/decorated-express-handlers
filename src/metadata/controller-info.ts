import 'reflect-metadata';
import {Router} from 'express';

export const CONTROLLER_INFO_METADATA = Symbol('controllerInfo');

export interface ControllerInfo {
    path: string;
    router: Router;
}

export function setControllerInfo(target: Record<string, any>, info: ControllerInfo[]): void {
    Reflect.defineMetadata(CONTROLLER_INFO_METADATA, info, target);
}

export function getControllerInfoOf(target: Record<string, any>): ControllerInfo[] {
    return Reflect.getOwnMetadata(CONTROLLER_INFO_METADATA, target) || [];
}

export function isController(target: Record<string, any>): boolean {
    return getControllerInfoOf(target).length > 0;
}
