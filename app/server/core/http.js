import https from 'https';

// A Promise wrapper around the https module.
// We do this to allow us to use async await with our get requests.
export function httpGetPromise(options, resultsKey) {
    return new Promise(function(resolve, reject) {
        const getRequest = https.request(options, function(res){
            let JSONStr = "";
            res.on('data', function(JSONChunkStr) {
                JSONStr += JSONChunkStr;
            });

            if(res.statusCode === 200){
                res.on('end', function() {
                    const JSONChunk = JSON.parse(JSONStr);

                    let results = JSONChunk;

                    if (resultsKey)
                        results = JSONChunk[resultsKey];

                    resolve(results);
                });
            }
            else{
                console.log("Error Processing JSON!");

                res.on('end', function() {
                    console.log('Response: ' + JSONStr);
                    reject(err);
                });
            }

        });
        
        getRequest.on('error', function(err){
            reject(err);
        });

        getRequest.end();
    });
}