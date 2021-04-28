const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            
            author: '607a5d6f4bc892709d998465',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
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
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})