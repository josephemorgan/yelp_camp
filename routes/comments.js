const express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get('/:comment_id/edit', (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
        } else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: comment
            });
        }
    });
});

router.put('/:comment_id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {

        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete('/:comment_id', (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {

    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
         res.redirect('/login');
    }
}

module.exports = router;