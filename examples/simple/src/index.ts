import {Controller, Get, RouteParam} from '../../../src/lib';
import {bootstrap} from "../../../src/bootstrap/bootstrap";

@Controller("/users")
class UserController {

    @Get('/:id')
    getUserById(@RouteParam('id') id: number): string {
        return `You asked for user ${id}`;
    }

}

bootstrap(UserController).then((app) => {
    app.listen(8000, () => console.log('Listening on http://localhost:8000/'));
}).catch(() => {
    console.error("Unable to start server.");
});

