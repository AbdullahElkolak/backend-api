import { httpGetPromise } from '../../../app/server/core/http'

describe('Unit', () => {
    describe('http', () => {
        describe('httpGetPromise', () => {
            it('should return a promise', () => {
                const result = httpGetPromise({});

                expect(result instanceof Promise).to.be.true;
            })
        });
    });
});