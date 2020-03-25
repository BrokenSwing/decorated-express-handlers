import {Handler} from './handler';
import * as Express from 'express';
import {RouteParam} from './decorators';

class A {

    @Handler()
    a(@RouteParam('id') a: number): string {
        return `Id is ${a}`;
    }

}

const a = new A();
const app = Express();
app.get('/:id', a.a);
app.listen(8000, () => console.log('Listening ...'));
