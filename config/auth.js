module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please sign in to view this resource');
        res.redirect('/signIn');
    },
    ensureAuthenticated2: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please sign in to view this resource');
        res.redirect('/admin/signIn');
    }
}