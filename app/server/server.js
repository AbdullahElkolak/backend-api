import path from 'path';

// Express
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import morgan from 'morgan';

import Controllers from './controllers';

import serverRoutes from './routes/serverRoutes';

export default class Server {
    constructor() {
        const app = express();

        this.app = app;

        this.setupViewEngine(app);
        this.setupCoreMiddleware(app);
        this.setupControllersRoutes(app);
        this.setupErrorHandling(app);

        return {
            start: this.start.bind(this),
            stop: this.stop.bind(this)
        };
    }

    setupViewEngine(app) {
        // EJS Template Rendering
        app.set('view engine', 'ejs');
        app.set('views', __dirname + '/views');
    }

    setupCoreMiddleware(app) {
        // Express
        app.use(morgan('combined'));
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({
            extended: true,
            limit: '1mb'
        }));
        app.use(bodyParser.json({
            limit: '1mb'
        }));
        app.use(session({
            secret: 'qantas_salt',
            name: 'qantas',
            resave: true,
            saveUninitialized: true
        }));

        app.use('/static', express.static(__dirname + '/../../dist'));
    }

    setupControllersRoutes(app) {
        const controllers = new Controllers();  // Would pass in 'models' as parameter to Controllers if it exists

        const router = serverRoutes(controllers);
        app.use(router);

        return { controllers };
    }

    setupErrorHandling(app) {
        // Catch all error back end error handler (add this last, and after other app.use() and route calls).
        // Note: the un-used 'next' parameter is NEEDED to signify to express that it is an error handler.
        /* eslint-disable no-unused-vars */
        app.use((err, req, res, next) => {
            console.log('error', err, err.stack);
            res.status(500);
            res.render('error.html.ejs');
        });
        /* eslint-enable no-unused-vars */

        // Catch the uncaught errors that weren't wrapped in a try catch statement
        // Do not use this in modules, but only in applications, as otherwise we could have multiple of these bound.
        // https://nodejs.org/api/process.html#process_event_uncaughtexception
        process.on('uncaughtException', function handleUncaughtExceptions(err) {
            // handle the error
            console.log('error', 'Uncaught exception:', err);
            process.exit(1);
        });
    }

    start() {
        this.requestListener = this.app.listen(3002, 'localhost', (err) => {
            if (err) {
                return console.log('error', err);
            }

            console.log('info', 'Listening at localhost:' + 3002);
        });
    }

    stop() {
        if (this.requestListener !== undefined) {
            this.requestListener.close();
            this.requestListener = undefined;
        }
    }
}




