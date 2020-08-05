import {getControllerInfoOf, isController} from '../metadata';
import {logger} from '../logger';
import * as Express from 'express';
import * as bodyParser from 'body-parser';

/**
 * Represents a class type.
 */
interface Type<T> extends Function {
     new (... args: any[]): T;
}

/**
 * Bootstraps an express application with the given controllers.
 * The given controllers will be mounted on the application.
 *
 * @param types A list a classes decorated as controllers
 */
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
    app.use(bodyParser.json());

    types.flatMap((t) => getControllerInfoOf(t))
        .forEach((info) => {
            app.use(info.path, info.router);
        });
    return Promise.resolve(app);
}
