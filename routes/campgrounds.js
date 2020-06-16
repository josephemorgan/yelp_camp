const express = require("express");
const router = express.Router();
const Campground = require("../models/campground")


router.get('/', (req, res) => {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("./campgrounds/index", {campgrounds:campgrounds});
        }
    })
});

router.post('/', isLoggedIn, (req, res) => {
    Campground.create(
        {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        }, function(err, new_campground) {
        if (err) {
            console.log(err);
        } else {
            console.log("Campground created: " + new_campground);
        }
    });
    res.redirect('/');
});

router.get('/new', isLoggedIn, (req, res) => {
    res.render("./campgrounds/new.ejs")
});

router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render("campgrounds/edit", {campground: campground});
    });
});

router.put('/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }, (err, campground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete('/:id', checkCampgroundOwnership, async(req, res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        res.redirect("/campgrounds");
    } catch (error) {
        console.log(error.message);
        res.redirect("back");
    }
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
         res.redirect('/login');
    }
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                res.redirect("back");
            } else if (campground.author.id.equals(req.user._id)) {
                next();
            }
        });
    }  else {
        res.redirect("/login");
    }
}

module.exports = router;