const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static('./assets'));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes/index'));

app.listen(port, function(err){
    if(err)
    {
        console.log(`error in firing the server : ${err}`);
        return;
    }
    console.log(`server up and running on port :${port}`);
});