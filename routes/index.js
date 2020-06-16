const express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

router.get('/', (req, res) => {
    res.render("landing");
});

router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, () => {
                 res.redirect('/campgrounds');
            });
        }
    });
});

router.get('/login', (req, res) => {
    res.render("login");
});

router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res) => {});

router.get('/logout', (req, res) => {
    req.logout();
     res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
         res.redirect('/login');
    }
}

module.exports = router;