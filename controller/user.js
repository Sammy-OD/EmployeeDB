const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const { ensureAuthenticated } = require('../config/auth');

router.get('/dashboard', ensureAuthenticated, (req, res)=> {
    Employee.countDocuments({ user_id: req.user._id })
        .then(count => {
            Employee.aggregate([{ $match: { user_id: req.user._id } }, { $group: { _id: "$department", total: { $sum: 1 }}}])
            .then(result => {
                res.render('dashboard', {
                    title: "Dashboard",
                    name: req.user.fullName,
                    totalEmployee: count,
                    department: result
                });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

router.get('/create', ensureAuthenticated, (req, res)=> {
    res.render('create', {
        title: "New Entry",
        icon: "fa fa-user-plus"
    });
});

router.post('/create', ensureAuthenticated, (req, res)=> {
    if (req.body.id == '') {
        const employee = new Employee(req.body);
        employee.user_id = req.user._id;
        employee.save()
            .then(()=> {
                res.redirect('/list');
            })
            .catch(err=> console.log(err));
    } else {
        Employee.findByIdAndUpdate(req.body.id, req.body, { useFindAndModify:false })
            .then(()=> {
                res.redirect('/list')
            })
            .catch(err=> console.log(err));
    }
});

router.get('/list', ensureAuthenticated, (req, res)=> {
    Employee.find({ user_id: req.user._id })
        .then((doc)=> {
            res.render('list', {
                title: "Employee List",
                list: doc
            });
        })
        .catch(err=> console.log(err));
});

router.get('/edit/:id', ensureAuthenticated, (req, res)=> {
    Employee.findById(req.params.id)
        .then((doc)=> {
            res.render('create', {
                title: "Edit Employee",
                icon: "fa fa-pen",
                employee: doc
            });
        })
        .catch(err=> console.log(err));
});

router.get('/delete/:id', ensureAuthenticated, (req, res)=> {
    Employee.findByIdAndRemove(req.params.id, { useFindAndModify:false })
        .then(()=> {
            res.redirect('/list');
        })
        .catch(err=> console.log(err));
});

router.get('/signOut', ensureAuthenticated, (req, res)=> {
    req.logOut();
    req.flash('success_msg', 'You have successfully signed out');
    res.redirect('/signIn');
});


module.exports = router;