const routers = require('../routers');
const config = require('../config/config');

module.exports = (app) => {
    app.use('/', routers.home);
    app.use('/home', routers.home);
    app.use('/user', routers.user);
    app.use('/expense', routers.expense);

    app.use('*', (req, res, next) => {
        const user = req.cookies[config.cookie] != undefined;
        res.render('404', { user });
    })
};