const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const secret = 'secret';

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser(secret));

    app.use(express.static(path.resolve(__basedir, 'static')));

    app.engine('hbs', handlebars({
        layoutsDir: 'views',
        defaultLayout: 'main-layout',
        partialsDir: 'views/partials',
        extname: 'hbs'
    }));

    app.set('view engine', '.hbs');

    app.set('views', path.resolve(__basedir, 'views'));
};