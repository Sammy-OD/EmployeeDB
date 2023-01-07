const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Employee = require('../models/employee');
const { ensureAuthenticated2 } = require('../config/auth');

router.get('/', (req, res)=> {
    res.redirect('/admin/signIn');
});

router.get('/signIn', (req, res)=> {
    res.render('admin_signIn');
});

router.post('/signIn', (req, res, next)=> {
    passport.authenticate('admin-local', {
        successRedirect: '/admin/dashboard',
        failureRedirect: '/admin/signIn',
        failureFlash: true
    })(req, res, next);
});

router.get('/dashboard', ensureAuthenticated2, (req, res)=> {
    User.find()
        .then((doc)=> {
            res.render('admin_dashboard', {
                list: doc
            });
        })
        .catch(err=> console.log(err));
});

router.get('/delete/:id', ensureAuthenticated2, (req, res)=> {
    User.findByIdAndRemove({ _id: req.params.id }, { useFindAndModify: false })
        .then((user)=> {
            Employee.deleteMany({ user_id: user.id })
                .then(()=> {
                    res.redirect('/admin/dashboard');
                })
                .catch(err=> console.log(err));
        })
        .catch(err=> console.log(err));
});

router.get('/signOut', ensureAuthenticated2, (req, res)=> {
    req.logOut();
    req.flash('success_msg', 'You have successfully signed out');
    res.redirect('/admin/signIn');
});


module.exports = router;