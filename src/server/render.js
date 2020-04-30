export default async function handleRender(req, res, next) {
    try {
        res.sendFile(`${process.cwd()}/src/server/index.html`);
    } catch (err) {
        next(err);
    }
}
