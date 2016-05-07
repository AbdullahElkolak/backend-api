import Server from '../../app/server/server';
import http from 'http';

describe('Functional', () => {
    describe('Server', () => {
        let server;
        let postOptions = {
            hostname: 'localhost',
            port: '3002',
            method: 'GET',
            path: '/test'
        };

        before(() => {
            server = new Server();
            server.start();
        });

        it('should respond', (done) => {
            const request = http.request(postOptions, function(res) {
                expect(res.statusCode).to.be.eq(200);
                done();
            });

            request.end();
        });


        it('should not respond after server stops', (done) => {
            server.stop();

            const request = http.request(postOptions);

            request.on('error', function(err) {
                expect(err).to.not.be.undefined;
                done();
            });

            request.end();
        });
    });
});