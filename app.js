require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('./middleware/auth');
const app= express();

app.use(express.json());

//register
app.post("/register", async (req, res) => {
    try{
        //get user input
        const {first_name, last_name, email, password} = req.body;
        //validate user input
        if(!(email && password && first_name && last_name)){
            res.status(400).send("All input is required");
        }
        //check if user already exist
        const oldUser = await User.findOne({email});
        if(oldUser){
            return res.status(400).send("User already exist. Please login");
        }
        //encrypt password
        encryptedPassword = await bcrypt.hash(password, 10);
        //create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        //create token
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {expiresIn: "2h"}
        );
        // save user token
        user.token = token;
        await user.save();
        //return new user
        res.status(201).json(user);
    }catch (error) {
        console.log(error);
    }
})

//login gose here
app.post("/login", async (req, res) => {
     try{
        const{email, password} = req.body;

        if(!(email && password)){
            res.status(400).send("All input is required");
        }

        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))){
            const  token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )
            user.token = token;
            await user.save();
            return res.status(200).json(user);
        }
        
        return res.status(400).send("Invalid Credentials");

     }catch(err){
        console.log(err)
     }

})

app.post('/welcome', auth, (req, res)=>{
    res.status(200).send('Welcome');
})

module.exports = app;
