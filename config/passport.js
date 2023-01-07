const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Admin = require('../models/admin');


function SessionConstructor(userId, userGroup) {
    this.userId = userId;
    this.userGroup = userGroup;
}

module.exports = (passport)=> {
    passport.use('user-local', new localStrategy({ usernameField: 'email' }, (email, password, done)=> {
        User.findOne({ email: email })
            .then((user)=> {
                if (!user) {
                    return done(null, false, {message: 'That Email is not registered!'});
                }

                if (password === user.password){
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password Incorrect'});
                }
            })
            .catch(err=> console.log(err));
    }));

    passport.use('admin-local', new localStrategy({ usernameField: 'email' }, (email, password, done)=> {
        Admin.findOne({ email: email })
            .then((admin)=> {
                if (!admin) {
                    return done(null, false, {message: 'That Email is not registered!'});
                }

                if (password === admin.password){
                    return done(null, admin);
                } else {
                    return done(null, false, { message: 'Password Incorrect'});
                }
            })
            .catch(err=> console.log(err));
    }));

    passport.serializeUser((userObject, done)=> {
        let userGroup = "user";
        let userPrototype = Object.getPrototypeOf(userObject);

        if (userPrototype === User.prototype) {
            userGroup = "user";
        } else if (userPrototype === Admin.prototype) {
            userGroup = "admin";
        }
        
        let sessionConstructor = new SessionConstructor(userObject.id, userGroup);
        done(null, sessionConstructor);
    });

    passport.deserializeUser((sessionConstructor, done)=> {
        if (sessionConstructor.userGroup === "user") {
            User.findById(sessionConstructor.userId, '-localStrategy.password', (err, user)=> {
                done(err, user);
            });
        } else if (sessionConstructor.userGroup === "admin") {
            Admin.findById(sessionConstructor.userId, '-localStrategy.password', (err, user)=> {
                done(err, user);
            });
        }
    });
}