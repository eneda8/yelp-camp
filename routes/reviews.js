const express = require("express");
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");

router.post("/", isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "New review created!")
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req,res) =>{
    //$pull removes from an existing array all instances of a value or values that match a specified condition
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) //deletes the review id from the array in the campground references the review
    await Review.findByIdAndDelete(req.params.reviewId); //deletes the review itself from the reviews collection
    req.flash("success", "Review deleted");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;