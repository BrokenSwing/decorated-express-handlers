import {getControllerInfoOf, isController} from '../metadata/controller-info';
import {logger} from '../logger';
import * as Express from 'express';

interface Type<T> extends Function {
     new (... args: any[]): T;
}

export function bootstrap(... types: Type<any>[]): Promise<Express.Express> {
    for (let i = 0; i < types.length; i++) {
        const t = types[i];
        if (!isController(t)) {
            logger.error('Can\'t bootstrap a class that isn\'t a controller.');
            logger.error(`Class ${t.name} isn't a controller.`);
            return Promise.reject();
        }
    }

    const app = Express();
    types.flatMap((t) => getControllerInfoOf(t))
        .forEach((info) => {
            app.use(info.path, info.router);
        });
    return Promise.resolve(app);
}
