const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers");

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

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const price = Math.floor(Math.random() *20) + 10;
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: "607a5d6f4bc892709d998465",
            images: [
                {
                url: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1619136220/YelpCamp/xedjbhux7rfi1kihv03d.jpg", 
                filename: "YelpCamp/xedjbhux7rfi1kihv03d" 
            },
            {
                url: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1619136174/YelpCamp/oultxkr0pjpidmdqsu1s.jpg", 
                filename: "YelpCamp/oultxkr0pjpidmdqsu1s"
            },
            {
                url: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1619136149/YelpCamp/mcuiczu0lglmhzqhflbx.jpg", 
                filename: "YelpCamp/mcuiczu0lglmhzqhflbx"
            },
            {
                url: "https://res.cloudinary.com/dw3o86f8j/image/upload/v1619136123/YelpCamp/hnexyqufqmnpdso5v0ks.jpg", 
                filename: "YelpCamp/hnexyqufqmnpdso5v0ks"
            }
            ],
            description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sit amet tortor vitae turpis ultrices fringilla. Vestibulum ac sem ac libero lobortis ornare. Donec sit amet tristique turpis.",
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
});