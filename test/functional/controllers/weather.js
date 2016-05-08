import Weather from '../../../api/server/controllers/weather';
import daysOfWeek from '../../../api/server/constants/daysOfWeek';

describe('Functional', () => {
    describe('Controllers', () => {
        let weather;
        describe('Weather', function() {
            this.timeout(20000);

            beforeEach(() => {
                weather = new Weather({});
            });

            describe('getWeather', () => {
                it('should return result with correct location, next week today, and a temperature value, when no day is specified (in json format)', (done) => {
                    const dateObj = new Date();
                    const currentDayNum = dateObj.getDay();
                    const currentDay = daysOfWeek[currentDayNum];

                    const req = {
                        params: {
                            location: 'sydney'
                        },
                        query: {}
                    };

                    const res = {};

                    weather.getWeather(req, res, function() {
                        expect(res.result instanceof Object).to.be.true;

                        const result = res.result;

                        expect(result.location).to.eq('sydney');
                        expect(result.day).to.eq(currentDay);
                        expect(result.temperature).to.not.be.undefined;

                        done();
                    });
                });

                it('should return result with correct location, today, and a temperature value, when today is specified (in json format)', (done) => {
                    const dateObj = new Date();
                    const currentDayNum = dateObj.getDay();

                    const req = {
                        params: {
                            location: 'sydney',
                            day: 'today'
                        },
                        query: {}
                    };

                    const res = {};

                    weather.getWeather(req, res, function() {
                        expect(res.result instanceof Object).to.be.true;

                        const result = res.result;

                        expect(result.location).to.eq('sydney');
                        expect(result.day).to.eq('today');
                        expect(result.temperature).to.not.be.undefined;

                        done();
                    });
                });

                it('should return result with correct location, yesterday\'s day, and a temperature value, when yesterday is specified (in json format)', (done) => {
                    const dateObj = new Date();
                    const currentDayNum = dateObj.getDay();

                    const yesterdayDayNum = (currentDayNum - 1 >= 0) ? currentDayNum - 1 : 6

                    const req = {
                        params: {
                            location: 'melbourne',
                            day: daysOfWeek[yesterdayDayNum]
                        },
                        query: {}
                    };

                    const res = {};

                    weather.getWeather(req, res, function() {
                        expect(res.result instanceof Object).to.be.true;

                        const result = res.result;

                        expect(result.location).to.eq('melbourne');
                        expect(result.day).to.eq(daysOfWeek[yesterdayDayNum]);
                        expect(result.temperature).to.not.be.undefined;

                        done();
                    });
                });

                it('should return result with correct location, tomorrow\'s day, and a temperature value, when tomorrow is specified (in json format)', (done) => {
                    const dateObj = new Date();
                    const currentDayNum = dateObj.getDay();

                    const tomorrowDayNum = (currentDayNum + 1 < 7) ? currentDayNum + 1 : 0;

                    const req = {
                        params: {
                            location: 'new york',
                            day: daysOfWeek[tomorrowDayNum]
                        },
                        query: {}
                    };

                    const res = {};

                    weather.getWeather(req, res, function() {
                        expect(res.result instanceof Object).to.be.true;

                        const result = res.result;

                        expect(result.location).to.eq('new york');
                        expect(result.day).to.eq(daysOfWeek[tomorrowDayNum]);
                        expect(result.temperature).to.not.be.undefined;

                        done();
                    });
                });

                it('should return result with correct location, next week today, and a temperature value, when no day is specified (in json format; explicity set)', (done) => {
                    const dateObj = new Date();
                    const currentDayNum = dateObj.getDay();
                    const currentDay = daysOfWeek[currentDayNum];

                    const req = {
                        params: {
                            location: 'sydney'
                        },
                        query: {
                            json: true
                        }
                    };

                    const res = {};

                    weather.getWeather(req, res, function() {
                        expect(res.result instanceof Object).to.be.true;

                        const result = res.result;

                        expect(result.location).to.eq('sydney');
                        expect(result.day).to.eq(currentDay);
                        expect(result.temperature).to.not.be.undefined;

                        done();
                    });
                });

                it('should return result with correct location, next week today, and a temperature value, when no day is specified (in plain text format)', (done) => {
                    const dateObj = new Date();
                    const currentDayNum = dateObj.getDay();
                    const currentDay = daysOfWeek[currentDayNum];

                    const req = {
                        params: {
                            location: 'Hong Kong'
                        },
                        query: {
                            json: false
                        }
                    };

                    const res = {};

                    weather.getWeather(req, res, function() {
                        expect(res.result instanceof Object).to.be.false;

                        const result = res.result;

                        expect(result.indexOf(`Hong Kong, ${currentDay}, `)).to.be.at.least(0);
                        done();
                    });
                });
            })
        });
    });
});