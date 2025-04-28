const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const compression = require("compression");
const auth = require("./routes/authRoutes")
const user = require("./routes/userRoutes")
const story = require("./routes/storyRoutes")
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json())
app.use(compression());
app.use("/api/auth",auth)
app.use("/api/user",user)
app.use("/api/story",story)
mongoose.connect(process.env.DB_PROD).then(()=>console.log("DB started")).catch(err=>{console.log("Connection error",err)});

app.listen(process.env.PORT||5000 , ()=>{
    console.log(`Server Running at : ${process.env.PORT}`);
})