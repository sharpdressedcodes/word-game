export default function injectCsrf(req, res, next) {
    res.cookie('csrfToken', req.csrfToken ? req.csrfToken() : null, { sameSite: true, httpOnly: true });
    next();
}
