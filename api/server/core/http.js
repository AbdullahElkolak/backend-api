import https from 'https';

// A Promise wrapper around the https module.
// We do this to allow us to use async await with our get requests.
export function httpGetPromise(options, resultsKey) {
    return new Promise(function promiseFn(resolve, reject) {
        const getRequest = https.request(options, function requestHandler(res) {
            let jsonStr = '';
            res.on('data', function dataHandler(jsonChunkStr) {
                jsonStr += jsonChunkStr;
            });

            if(res.statusCode === 200) {
                res.on('end', function requestEndHandler() {
                    const jsonChunk = JSON.parse(jsonStr);

                    let results = jsonChunk;

                    if (resultsKey) {
                        results = jsonChunk[resultsKey];
                    }

                    resolve(results);
                });
            }
            else {
                console.log('Error Processing JSON!');

                res.on('end', function requestEndHandler() {
                    console.log('Response: ' + jsonStr);
                    reject(err);
                });
            }
        });

        getRequest.on('error', function requestErrorHandler(err) {
            reject(err);
        });

        getRequest.end();
    });
}
