const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('cookie-session');
const flash = require('connect-flash');
const port = process.env.PORT || 4000;
const app = express();

require('dotenv').config();

//DB Config
const db = process.env.PROD_MONGO_URI;

//Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true } )
    .then(()=> console.log('DB Connection Successful...'))
    .catch(()=> console.log('DB Connection Failed...'));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

//BodyParser
app.use(express.urlencoded({ extended: true }));

// No User Serialized
app.use((req, res, next)=> {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});

//Express Session
app.use(session({
    secret: 'secret',
    resave: 'true',
    saveUninitialized: 'true'
}));

//Passort Config
require('./config/passport')(passport);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


//Routes
app.use('/', require('./controller/index'));
app.use('/', require('./controller/user'));
app.use('/admin', require('./controller/admin'));

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
})