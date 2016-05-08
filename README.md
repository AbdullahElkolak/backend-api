### Back End NodeJS Exercise

### Run Instructions
1. Ensure you have npm 5.5.0+ installed.

2. Install nodemon: ```npm install -g nodemon```

3. In root directory (./backend-api), run: ```npm i```

4. Then run: ```npm start```

5. Go to URL: ```http://localhost:3002/weather/sydney|brisbane|new york|china?json=false|true```

NOTE: Tested on Macbook / Chrome ONLY (no guarantees with other browsers).

### Test (with coverage) Instructions
1. Run ``` npm test ```

### Unit Test Instructions
1. Run ``` npm run test:unit ```

### Functional Test Instructions
1. Run ``` npm run test:functional ```


### Future improvements
* Kick off the server via PM2; which would monitor the instance, restart/reload it
if the server crashes or is killed; allows for the implementation of a cluster of server instances.


Thanks!
