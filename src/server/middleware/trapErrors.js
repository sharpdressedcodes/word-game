export default function trapErrors(err, req, res, next) {
    let status = null;
    let message = null;

    switch (err.code) {
        case 'ENOENT':
            status = 404;
            message = 'Not found';
            break;
        case 'EBADCSRFTOKEN':
            status = 403;
            message = 'Forbidden';
            break;
        default:
            status = 500;
            message = 'Internal server error';
    }

    if (req.xhr) {
        res.status(status).json({ error: `Error: ${message}` });
    } else {
        res.status(status).send(`Error: ${message}`);
    }
};
