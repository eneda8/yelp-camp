const Campground = require("../models/campground");
const ObjectID = require('mongodb').ObjectID;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({}); 
    res.render("campgrounds/index", {campgrounds});
} 

module.exports.renderNewForm = (req, res) => { 
res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(`Campground created: ${campground}`)
    req.flash("success", "New campground added!");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req,res, next) => { 
    const {id} = req.params;
    if (!ObjectID.isValid(id)) {
         req.flash("error", "Campground not found!")
        return res.redirect("/campgrounds");
    }
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
}

module.exports.renderEditForm = async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash("error", "Campground not found!")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground})
}

module.exports.updateCampground = async (req,res) => {
    const {id} = req.params;
    console.log(req.body); 
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}); 
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename})); // makes an array of objects
    campground.images.push(...imgs); 
    //spread: passes data from objects as separate arguments instead of pushing an array into an array (won't be accepted bc model is expecting an array of strings not an array of objects )
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        console.log(req.body)
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    } 
    req.flash("success", "Campground updated!");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted!");
    res.redirect("/campgrounds");
}