const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.resolve(__basedir, 'static')));
    app.engine('.hbs', handlebars({ extname: '.hbs', defaultLayout: false}));
    app.use('views', path.resolve(__basedir, 'views'));
};