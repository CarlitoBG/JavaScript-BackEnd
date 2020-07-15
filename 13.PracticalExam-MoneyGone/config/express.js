const express = require('express');
const path = require('path');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../config/config');

const secret = 'secret';

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(cookieParser(secret));

    app.use(express.static(path.resolve(__basedir, 'static')));

    app.engine('hbs', handlebars({
        layoutsDir: 'views',
        defaultLayout: 'main-layout',
        partialsDir: 'views/partials',
        extname: 'hbs',
        helpers: {
            toDate: function (date) { 
                return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
            }
        }
    }));

    app.use((req, res, next) => {
        res.locals.isLoggedIn = req.cookies[config.cookie] != undefined;
        res.locals.username = req.cookies['username'];

        next();
    })

    app.set('view engine', 'hbs');

    app.set('views', path.join(__basedir, 'views'));
};