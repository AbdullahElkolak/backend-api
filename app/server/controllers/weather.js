import { httpGetPromise } from '../core/http';
import daysOfWeek from '../../constants/daysOfWeek';
import apiKeys from '../../constants/apiKeys';

export default class Weather {
    constructor(delegator) {
        this.delegator = delegator;

        // Store this so we don't need to calculate it again
        this.millisecondsInDay = 24 * 60 * 60 * 1000;

        return {
            getWeather: this.getWeather.bind(this)
        };
    }

    async getLatitudeLongtitude(location) {
        // Escapes things like spaces in the location
        const encodedLocation = encodeURIComponent(location);

        const getOptions = {
            hostname: "maps.googleapis.com",
            method: "GET",
            path: "/maps/api/geocode/json?address=",
            headers: {
                "Content-Type": "application/json"
            }
        };

        getOptions.path = `/maps/api/geocode/json?address=${encodedLocation}&key=${apiKeys.google}`;

        const results = await httpGetPromise(getOptions, 'results');

        // Get geometry of first result.
        const geometry = results[0].geometry;
        const {lat, lng} = geometry.location;

        return {
            latitude: lat,
            longitude: lng
        };
    }

    calculateTimestamp(day) {
        const dateObj = new Date();
        const currentTimestampMs = +dateObj;

        let desiredDayTimestamp;
        if (day === undefined) {
            desiredDayTimestamp = currentTimestampMs + 7 * this.millisecondsInDay;
        }
        else {
            const currentDayNum = dateObj.getDay();
            const desiredDayNum = daysOfWeek[day];

            if (desiredDayNum > currentDayNum) {
                desiredDayTimestamp = currentTimestampMs + (desiredDayNum - currentDayNum) * this.millisecondsInDay;
            }
            else {
                desiredDayTimestamp = currentTimestampMs + (desiredDayNum - currentDayNum + 7) * this.millisecondsInDay;
            }
        }

        return desiredDayTimestamp;
    }

    async getWeather(req, res, next) {
        try {
            let { json } = req.query

            let { location, day } = req.params;

            // Format values
            json = json !== 'false';

            if (day !== undefined)
                day = day.toLowerCase();

            // Note: if day is undefined, just provide the forecast for 1 week from today.
            // If day === 'today', provide forecast for today.
            // Else, provide forecast for the specified day, which should always be a future day.

            // If json is true or undefined, then the response should be json

            // Get timestamp values both in milliseconds and seconds; prefix with comma if not empty string
            let timeMs = (day === 'today') ? '' : this.calculateTimestamp(day);
            let time = (timeMs !== '') ? `,${Math.round(timeMs / 1000)}` : timeMs;

            // Populate the day variable with today next week if it was previously undefined
            if (day === undefined)
                day = daysOfWeek[(new Date(timeMs)).getDay()];

            // First, get the latitude and longitude for the desired location
            const {latitude, longitude} = await this.getLatitudeLongtitude(location);

            // Compile the get options for this request to forecast.io
            const getOptions = {
                hostname: "api.forecast.io",
                method: "GET",
                path: `/forecast/${apiKeys.weather}/${latitude},${longitude}${time}?units=si`,
                headers: {
                    "Content-Type": "application/json"
                }
            };

            // Get the forecast results
            const results = await httpGetPromise(getOptions);

            // Determine whether to provide results in json or plain text
            if (json === false) {
                res.result = `${location}, ${day}, ${results.currently.temperature}`;   //should be plain text
            }
            else {
                res.result = {
                    location,
                    day,
                    temperature: results.currently.temperature
                };
            }

            return next();
        }
        catch(err) {
            next(err);
        }
    }

}