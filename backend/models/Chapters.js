const mongoose = require("mongoose");


const chapterSchema = new mongoose.Schema({
    chapterNumber : {
        type : Number,
        required : true
    },
    name : {
        type : String
    },
    content : {
        type : String
    },
    storyId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Story'
    }
})

const Chapters = mongoose.model("Chapters" , chapterSchema);
module.exports = Chapters;