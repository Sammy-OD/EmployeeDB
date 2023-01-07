const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req, res)=> {
    res.render('index');
});

router.get('/signUp', (req, res)=> {
    res.render('signUp');
});

router.get('/signIn', (req, res)=> {
    res.render('signIn');
});

router.post('/signUp', (req, res)=> {
    const { firstName, lastName, email, password, confirmPassword } = req.body
    let errors = [];
    
    //Check required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //Check password match
    if (password !== confirmPassword) {
        errors.push({ msg: 'Password mismatch' });
    }

    //Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('signUp', {
            errors,
            firstName,
            lastName,
            email,
        });
    } else {
        User.findOne({ email: email })
            .then((user)=> {
                if (user) {
                    errors.push({ msg: "Email is already registered!"});
                    res.render('signUp', {
                        errors,
                        firstName,
                        lastName,
                    });
                } else {
                    const newUser = new User({
                        firstName,
                        lastName,
                        email,
                        password
                    });

                    newUser.save()
                        .then(()=> {
                            req.flash('success_msg', 'Registration Successful!... Please sign in to proceed');
                            res.redirect('signIn');
                        })
                        .catch(err=> console.log(err));
                }
            });
    }
});

router.post('/signIn', (req, res, next)=> {
    passport.authenticate('user-local', {
        successRedirect: '/dashboard',
        failureRedirect: '/signIn',
        failureFlash: true
    })(req, res, next);
});


module.exports = router;