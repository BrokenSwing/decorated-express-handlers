# ExWiDe

![Node.js CI](https://github.com/BrokenSwing/exwide/workflows/Node.js%20CI/badge.svg)

![logo](./assets/exwide_full.png)

*Exwide* is a framework that aims to simplify projects built using express 
and TypeScript. It takes advantage of TypeScript decorators and typing system to guess the format
you want the user input to be converted to and validates it to match your needs.

It also allows to design your project in a Controller/Service way with dependency injection 
(coming ASAP).

## Table of content

* [Setting up a project](#setting-up-a-project)
    * [Install the framework as a dependency](#install-the-framework-as-a-dependency)
    * [Configure TypeScript](#configure-typescript)
* [Getting started](#getting-started)
    * [Create a controller](#create-a-controller)
    * [Declare a request handler in a controller](#declare-a-request-handler-in-a-controller)
    * [Bootstrap the framework to run the application](#bootstrap-the-framework-to-run-the-application)
    * [Add a user provided parameter](#add-an-user-provided-parameter)

## Setting up a project

### Install the framework as a dependency

*Coming soon*

### Configure TypeScript

To use the framework you must configure your `tsconfig.json` with the three following options:
```json
{
  "compilerOptions": {
    "target": "ES2019",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  }
}
```

The first one allows to use `Array#flatMap` and the two other ones allow the usage of decorators.

Some example projects can be found in [the example folder](https://github.com/BrokenSwing/exwide/tree/master/examples).

## Getting started

You need to have a setup project to continue. If you haven't, follow [these steps](#setting-up-a-project).

### Create a controller

The first step is to create a controller. A controller is class decorated with the `@Controller`
decorator.

```ts
import {Controller} from 'exwide';

@Controller('/hello')
class HelloController {

}
```

This is the simplest controller you can create. It just does nothing.

### Declare a request handler in a controller

Let's add a request handler to handles GET requests on URL `/hello` and returns `Hello, world!`.
A request handler is a class method defined in a controller. This one is decorated with one 
of specialized handler decorators (`@Get`, `@Post`, etc ...).

Let's create the handler :
```ts
import {Controller, Get} from 'exwide';

@Controller('/hello')
class HelloController {

    @Get('/')
    helloWorld(): string {
        return 'Hello, world!';
    }

}
```

### Bootstrap the framework to run the application

Now we have defined a request handler, we can simply run the application. You can
use the `bootstrap` function and pass the controller as an argument to start the application.

```ts
import {Controller, Get, bootstrap} from 'exwide';

@Controller('/hello')
class HelloController {

    @Get('/')
    helloWorld(): string {
        return 'Hello, world!';
    }

}

bootstrap(HelloController).then((app) => {
    app.listen(8000, () => console.log('Visit http://localhost:8000/hello/'));
}).catch(() => console.error('Unable to start the application'));
```

You can now visit [http://localhost:8000/hello/](http://localhost:8000/hello/) and you'll see
a page returning `Hello, world!`.

### Add an user provided parameter

We now want to display `Hello, George!` if a GET request is made on `/hello/George`, or
to any other name. Let's add a parameter that matches the name.

```ts
import {Controller, Get, bootstrap, RouteParam} from 'exwide';

@Controller('/hello')
class HelloController {

    @Get('/')
    helloWorld(): string {
        return 'Hello, world!';
    }
    
    @Get('/:name')
    helloAnyone(@RouteParam('name') userName: string): string {
        return `Hello, ${userName}!`;
    }

}

bootstrap(HelloController).then((app) => {
    app.listen(8000, () => console.log('Visit http://localhost:8000/hello/George'));
}).catch(() => console.error('Unable to start the application'));
```

Now you can visit [http://localhost:8000/hello/George](http://localhost:8000/hello/George) and
the message `Hello, George!` will be displayed. The framework finds the `name` parameter in the
route (the parsing is done by express of course) then pass it to our method.

Now, we want to display `n` times the messages, the `n` value being passed by user. We want
the URL `/hello/George/?times=5` to display :
```text
Hello, George!
Hello, George!
Hello, George!
Hello, George!
Hello, George!
```

Let's do this :
```ts
import {Controller, Get, bootstrap, RouteParam, QueryParam} from 'exwide';

@Controller('/hello')
class HelloController {

    @Get('/')
    helloWorld(): string {
        return 'Hello, world!';
    }

    @Get('/:name')
    helloMultiple(@RouteParam('name') userName: string, @QueryParam('times') n: number): string {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += `Hello, ${userName}!<br>`;
        }
        return result;
    }
    
    @Get('/:name')
    helloAnyone(@RouteParam('name') userName: string): string {
        return `Hello, ${userName}!`;
    }

}

bootstrap(HelloController).then((app) => {
    app.listen(8000, () => console.log('Visit http://localhost:8000/hello/George?times=5'));
}).catch(() => console.error('Unable to start the application'));
```

*(take care a method placement, they're tested in declaration order)*

Visit [http://localhost:8000/hello/George?times=5](http://localhost:8000/hello/George?times=5),
you should see the appropriate message printed 5 times.
