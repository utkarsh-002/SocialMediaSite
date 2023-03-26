const router  = require("express").Router();
const User  = require("../models/User");
const bcrypt = require("bcrypt");

//register
router.post("/register", async(req,res)=>{

    try {
        //create encrypted password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password,salt);
        //create new user
        // const newUser = new User({
        //     username: req.body.username,
        //     email:req.body.email,
        //     password:hashedPassword,
        // });
        const newUser = new User(req.body);
        //save the user
        const user = await newUser.save();
        res.status(200).json(user);
        
    } catch (err) {
        console.log(err);
    }
});

//login
router.post("/login",async(req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("User not found!!");
        if(user)
        {
            const validPassword = await bcrypt.compare(req.body.password,user.password);
            !validPassword ? res.status(403).json("password incorrect!!"):
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router