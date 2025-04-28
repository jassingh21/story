const mongoose = require("mongoose")

const newsLetterSchema = new mongoose.Schema({
    email : {type : String,unique : true,match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],required: true,}
});

const NewsLetter = mongoose.model("Newletter" , newsLetterSchema);
module.exports = NewsLetter;