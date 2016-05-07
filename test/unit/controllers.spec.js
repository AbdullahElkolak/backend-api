import Controllers from '../../app/server/controllers';
import proxyquire from 'proxyquire';
proxyquire.noCallThru();
proxyquire.noPreserveCache();

describe('Unit', () => {
    describe('Controllers', () => {
        let subscribeSpy;
        let controllers;

        before(() => {
            subscribeSpy = sinon.spy();
            const Controllers = proxyquire('../../app/server/controllers', {
                './controllers/delegator': () => {
                    return {
                        subscribe: subscribeSpy
                    };
                },
                './controllers/weather': () => {
                }
            }).default;

            controllers = new Controllers();
        });


        it('should call delegator\'s subscribe', () => {
            expect(subscribeSpy).calledOnce;
        });

        it('should return expected controllers object', () => {
            expect(controllers.hasOwnProperty('weather')).to.be.true;
        });
    });
});