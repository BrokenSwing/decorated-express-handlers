import * as Express from 'express';
import {Get, RouteParam, Controller} from './decorators';

@Controller()
class A {

    public router!: Express.Router;

    constructor(
        private s: string
    ) {}

    @Get('/:id')
    a(@RouteParam('id') id: number): string {
        return `Id is ${id} and s is ${this.s}`;
    }

}

const a = new A('');
const app = Express();
app.use('/', a.router);
app.listen(8000, () => console.log('Listening ...'));
