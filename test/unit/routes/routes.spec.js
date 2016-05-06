import express from 'express';
import routes from '../../../app/server/routes/serverRoutes';
//import UserController from '../../../server/controllers/user';
//import UrlUploaderController from '../../../server/controllers/urlUploader';
//import ClientLoggerController from '../../../server/controllers/clientLogger';
import * as supertest from 'supertest';

describe('Routes',  () => {
    const app = express();

    // EJS Template Rendering
    app.set('view engine', 'ejs');
    app.set('views', './server/views');

    let controllers;
    let weatherController;
    let router;
    let agent;

    let resRenderSpy;
    let getWeatherSpy;

    beforeEach(() => {
        resRenderSpy = sinon.spy();
        getWeatherSpy = sinon.spy();

        weatherController = () => {
            return {
                getWeather: (req, res, next) => {
                    getWeatherSpy();
                    res.render = resRenderSpy;
                    next();

                    // Set status 200 here, since our render spy doesn't do it.
                    res.status(200).end();
                }
            }
        };

        controllers = {
            weather: new weatherController()
        };

        router = routes(controllers);
        app.use(router);

        agent = supertest.agent(app);
    });

    describe('/weather/:location/today', () => {
        it('returns success', (done) => {
            agent
                .get('/weather/sydney/today')
                .expect(() => {
                    expect(getWeatherSpy).calledOnce;
                    expect(resRenderSpy).calledOnce;
                })
                .expect(200)
                .end((err) => {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });
    });
});
