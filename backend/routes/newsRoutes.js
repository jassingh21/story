const express = require("express");
const NewsLetter = require("../models/Newsletters");
const newsLetterRouter = express.Router();

newsLetterRouter.post("/subscribe" , async(req,res)=>{
    try {
        const {email} = req.body;
        if(!email){
            return res.status(404).json({"Message" : "Email Not Found"});
        }
        const checkEmail = await NewsLetter.findOne({email});
        if(checkEmail){
            return res.status(500).json({"Message" : "Already Subscribed"});
        }
        const newUser = new NewsLetter({email : email});
        await newUser.save();
        return res.status(200).json({"Message" : "Subscribed"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

newsLetterRouter.post("/unsubscribe", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const deletedUser = await NewsLetter.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: "Email not found in subscription list" });
        }

        return res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = newsLetterRouter;