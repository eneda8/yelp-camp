const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
require('dotenv').config();

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
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
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            
            author: '608b5ed84e7d86bf77f8a601',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
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
                },
                {
                    url:"https://res.cloudinary.com/dw3o86f8j/image/upload/v1619728297/YelpCamp/photo-1513104399965-f5160d963d39_nwkmbt.jpg", 
                    filename: "YelpCamp/photo-1513104399965-f5160d963d39_nwkmbt"
                },
                {
                    url:"https://res.cloudinary.com/dw3o86f8j/image/upload/v1619728265/YelpCamp/photo-1445308394109-4ec2920981b1_gnscxe.jpg", 
                    filename: "YelpCamp/photo-1445308394109-4ec2920981b1_gnscxe"
                },
                {
                    url:"https://res.cloudinary.com/dw3o86f8j/image/upload/v1619728234/YelpCamp/photo-1476041800959-2f6bb412c8ce_w47wal.jpg", 
                    filename: "YelpCamp/photo-1476041800959-2f6bb412c8ce_w47wal"
                },
                {
                    url:"https://res.cloudinary.com/dw3o86f8j/image/upload/v1619728219/YelpCamp/photo-1471115853179-bb1d604434e0_qyjl92.jpg", 
                    filename: "YelpCamp/photo-1471115853179-bb1d604434e0_qyjl92"
                },
                {
                    url:"https://res.cloudinary.com/dw3o86f8j/image/upload/v1619728199/YelpCamp/photo-1537225228614-56cc3556d7ed_iny2ib.jpg", 
                    filename: "YelpCamp/photo-1537225228614-56cc3556d7ed_iny2ib"
                },
                {
                    url:"https://res.cloudinary.com/dw3o86f8j/image/upload/v1619728182/YelpCamp/photo-1496545672447-f699b503d270_auhjqo.jpg", 
                    filename: "YelpCamp/photo-1496545672447-f699b503d270_auhjqo"
                },
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})