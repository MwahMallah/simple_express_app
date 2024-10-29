const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_CONN_STR)
    .then(_ => console.log("Connected to MongoDB"))
    .catch(_ => console.log("Error connecting to MongoDB"));

const personScheme = new mongoose.Schema({
    name: {type: String, minLength: 3},
    number: {type: String},
});

personScheme.set("toJSON", {
    transform: (fromDb, toResponse) => {
        toResponse.id = toResponse._id.toString();
        delete toResponse._id;
        delete toResponse.__v;
    }
});

module.exports = mongoose.model("Person", personScheme);