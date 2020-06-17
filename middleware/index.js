const Campground = require("../models/campground.js"),
	Comments = require("../models/comment.js");

const middleware = {
	checkCampgroundOwnership: function checkCampgroundOwnership(req, res, next) {
		if (req.isAuthenticated()) {
			Campground.findById(req.params.id, (err, campground) => {
				if (err) {
					req.flash("error", "Campground not found");
					res.redirect("back");
					
				} else if (!campground) {
					req.flash("error", "Item not found");
					return res.redirect("back");
				} else if (campground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			});
		}  else {
			req.flash("error", "You need to be logged in to do that");
			res.redirect("/login");
		}
	},
	checkCommentOwnership: function checkCommentOwnership(req, res, next) {
		if (req.isAuthenticated()) {
			Comment.findById(req.params.comment_id, (err, comment) => {
				if (err) {
					res.redirect("back");
				} else if (!comment) {
					req.flash("error", "Item not found");
				} else if (comment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			});
		}  else {
			req.flash("error", "You need to be logged in to do that.");
			res.redirect("back");
		}
	},
	isLoggedIn: function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			req.flash("error", "You need to be logged in to do that.");
			res.redirect('/login');
		}
	}
};

module.exports = middleware;
