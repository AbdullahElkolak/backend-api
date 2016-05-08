import { Router } from 'express';

//This is the function that's called when it's time to send a result back to the client.
function sender(req, res) {
    return res.render('index.html.ejs', {
        data: JSON.stringify(res.result)
    });
}

export default function serverRoutes(controllers) {
    const router = new Router();

    const weatherController = controllers.weather;

    router.get('/weather/:location/:day', weatherController.getWeather, sender);
    router.get('/weather/:location', weatherController.getWeather, sender);

    router.get('/test', (req, res) => {
        res.status(200).end();
    });

    // If no middleware matches, then return 404.
    router.get('*', (req, res) => {
        res.status(404).end('Not found.');
    });

    return router;
}
