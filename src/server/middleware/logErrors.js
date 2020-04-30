export default function logErrors(err, req, res, next) {
    console.error(err);
    next(err);
};
