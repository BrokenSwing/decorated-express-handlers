import * as Express from 'express';
import {Controller, Get, RouteParam} from '../../../src/lib';

@Controller()
class UserController {

    public router!: Express.Router;

    @Get('/:id')
    getUserById(@RouteParam('id') id: number): string {
        return `You asked for user ${id}`;
    }

}

const app = Express();
const userController = new UserController();
app.use('/users', userController.router);
app.listen(8000, () => console.log('Listening on http://localhost:8000/'));

