const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const {campgroundSchema} = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const { join } = require("path");


mongoose.connect("mongodb://localhost:27017/yelpcamp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true})); //allows body to be parsed so we can use req.body
app.use(methodOverride("_method"));


const validateCampground = (req, res, next) => {  
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get("/", (req,res) => {
    res.render("home")
})

app.get("/campgrounds", catchAsync(async (req,res) => { //async bc the mongoose function takes time
    const campgrounds = await Campground.find() //queries the database for all instances of the model and saves to a variable
    res.render("campgrounds/index", {campgrounds})
}))

app.get("/campgrounds/new", (req, res) => { //this route has to be before the /:id route or it will treat "new" as :id
    res.render("campgrounds/new");
})

app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get("/campgrounds/:id", catchAsync(async (req,res) => { //async bc the mongoose function takes time
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", {campground})
}))

app.get("/campgrounds/:id/edit", catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", {campground})
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground} ) //spread operator spreads into properties into new object so we can use here as {title: "fdfs"}, location: "skjdfd"
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete("/campgrounds/:id", catchAsync(async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render("error", {err});
})

app.listen(3000, () => {
  console.log("Serving on port 3000")
})