const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true})); //allows body to be parsed so we can use req.body
app.use(methodOverride("_method"));

app.get("/", (req,res) => {
    res.render("home")
})

app.get("/campgrounds", async (req,res) => { //async bc the mongoose function takes time
    const campgrounds = await Campground.find() //queries the database for all instances of the model and saves to a variable
    res.render("campgrounds/index", {campgrounds})
})

app.get("/campgrounds/new", (req, res) => { //this route has to be before the /:id route or it will treat "new" as :id
    res.render("campgrounds/new");
})

app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get("/campgrounds/:id", async (req,res) => { //async bc the mongoose function takes time
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/show", {campground})
})

app.get("/campgrounds/:id/edit", async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", {campground})
})

app.put("/campgrounds/:id", async (req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground} ) //spread operator spreads into properties into new object so we can use here as {title: "fdfs"}, location: "skjdfd"
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete("/campgrounds/:id", async (req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
})

app.listen(3000, () => {
  console.log("Serving on port 3000")
})