import express from 'express';
import csrf from 'csurf';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import get from 'lodash.get';
// import { validateUrls } from './api';
import handleRender from './render';
import injectCsrf from './middleware/injectCsrf';
import logErrors from './middleware/logErrors';
import trapErrors from './middleware/trapErrors';
import fakeFavIcon from './middleware/fakeFavIcon';
import config from '../config/main';

const app = express();
const server = http.createServer(app);
const production = process.env.NODE_ENV === 'production';
const csrfMiddleware = csrf({ cookie: true, value: req => req.cookies.csrfToken });

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(fakeFavIcon);
app.use(express.static('dist', {
    maxAge: production ? '1y' : 0,
    index: false
}));

// app.post(
//     get(config, 'app.endpoints.api.validateUrls'),
//     csrfMiddleware,
//     validateUrls,
//     logErrors,
//     trapErrors,
// );

app.get(
    '/*',
    csrfMiddleware,
    injectCsrf,
    handleRender,
    logErrors,
    trapErrors,
);

server.setTimeout(0);

const listener = server.listen(process.env.PORT || get(config, 'app.port', 3001), err => {
    if (err) {
        throw err;
    }

    // eslint-disable-next-line no-console
    console.log(`server listening on port ${listener.address().port}`);
});
