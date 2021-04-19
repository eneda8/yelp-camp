const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const {isLoggedIn, validateCampground, isAuthor} = require("../middleware");

router.get("/", catchAsync(async (req,res) => { //async bc the mongoose function takes time
    const campgrounds = await Campground.find(); //queries the database for all instances of the model and saves to a variable
    res.render("campgrounds/index", {campgrounds});
}))

router.get("/new", isLoggedIn, (req, res) => { //this route has to be before the /:id route or it will treat "new" as :id
    res.render("campgrounds/new");
})

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "New campground added!");
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/:id", catchAsync(async (req,res) => { //async bc the mongoose function takes time
    const campground = await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
        }).populate("author");
    console.log(campground.author.username);
    if(!campground){
        req.flash("error", "Campground not found!")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground})
}))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash("error", "Campground not found!")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground})
}))

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground} ) //spread operator 
    req.flash("success", "Campground updated!")
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted!")
    res.redirect("/campgrounds")
}));

module.exports = router;