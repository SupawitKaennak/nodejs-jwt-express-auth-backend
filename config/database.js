const mongoose = require("mongoose");
const { MONGO_URL } = process.env;

exports.connect = () => {
    //connect to the database
    mongoose.connect(MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.log("Error connecting to database");
        console.log(error);
        process.exit(1);
    });
}
