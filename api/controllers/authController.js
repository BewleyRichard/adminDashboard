import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

/* Creates a new user by hashing the provided password with bcrypt, 
and saves it to the database using Mongoose. */

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        const newUser = new User ({
            ...req.body,
            password:hash,
        });

        await newUser.save();
        res.status(201).send("User registration complete");
    } catch (err) {
        next(err);
    }
};


export const login = async (req, res, next) => {

    try {
        // Searches the database for a user with the provided username. 
        const user = await User.findOne(({username:req.body.username}))
        if (!user) return next (createError(404, "user not found")) // may need to get rid of the next here.

        /* Verifies the password using bcrypt. If successful, it generates a JSON Web Token (JWT)
        and sends it to the client in a cookie. */
        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            user.password);
        
        if (!isPasswordCorrect) 
        return next (createError(400, "Wrong username or password"));

        const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET) 
        
        const { password, isAdmin, ...otherDetails} = user._doc;
        

        res
        .cookie("access_token", token, {
            httpOnly:true,
            
        })
        .status(200).json({ details:{...otherDetails}, isAdmin});
    } catch (err) {
        next(err)
    }
}














