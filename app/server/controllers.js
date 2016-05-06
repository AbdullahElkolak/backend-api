import Delegator from './controllers/delegator';
import Weather from './controllers/weather';

export default class Controllers {
    constructor() {
        return this.connect();
    }

    connect() {
        const delegator = new Delegator();

        const weather = delegator.subscribe('weather', new Weather(delegator));

        const controllers = {
            weather
        };

        return controllers;
    }
}
