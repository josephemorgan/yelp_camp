const express = require("express"),
	router = express.Router(),
	Campground = require("../models/campground"),
	middleware = require("../middleware/index.js");


router.get('/', (req, res) => {
	Campground.find({}, function(err, campgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("./campgrounds/index", {campgrounds:campgrounds});
		}
	})
});

router.post('/', middleware.isLoggedIn, (req, res) => {
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

router.get('/new', middleware.isLoggedIn, (req, res) => {
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

router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
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

router.delete('/:id', middleware.checkCampgroundOwnership, async(req, res) => {
	try {
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		res.redirect("/campgrounds");
	} catch (error) {
		console.log(error.message);
		res.redirect("back");
	}
});

module.exports = router;
