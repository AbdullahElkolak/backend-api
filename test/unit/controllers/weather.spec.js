import proxyquire from 'proxyquire';
proxyquire.noCallThru();
proxyquire.noPreserveCache();

describe('Unit', () => {
    describe('Controller', () => {
        describe('Weather', () => {
            let weather;
            let httpGetPromiseStub;
            before(() => {
                httpGetPromiseStub = sinon.stub().returns(new Promise((resolve, reject) => {
                    if (getOptions.hostname.indexOf('googleapis') >= 0) {
                        return resolve([
                            {
                                geometry: {
                                    location: {
                                        lat: 1,
                                        lng: 2
                                    }
                                }
                            }
                        ]);
                    }
                    else if (getOptions.hostname.indexOf('forecast.io') >= 0) {
                        return resolve([
                            {
                                currently: {
                                    temperature: 22
                                }
                            }
                        ]);
                    }

                    // Else, reject
                    reject();
                }));

                const Weather = proxyquire('../../../api/server/controllers/weather', {
                    '../core/http': {
                        httpGetPromise: httpGetPromiseStub
                    }
                }).default;

                weather = new Weather({});
            });

            describe('getWeather', () => {
                it('should call httpGetPromise with expected options', () => {
                    const req = {
                        params: {
                            location: 'Perth'
                        }
                    }

                    const res = {};

                    weather.getWeather(req, res, () => {
                        expect(httpGetPromiseStub).calledTwice;
                    });
                });
            })
        });
    });
});