import User from "../models/User.js";

// Update user controller function. 
export const updateUser = async (req,res,next) => {
    // Update user information based on user entry.
    try{
        /* Find user by id 
        and update db with the information entered by the user.
        Return the updated doc. */
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedUser)
    }catch(err){
        next(err);
    }
};

// Delete user controller function. 
export const deleteUser = async (req,res,next) => {
    
    try{
        /* Find user by id and delete it.*/
        await User.findByIdAndDelete(
            req.params.id
        );
        res.status(200).json("user has been deleted")
    }catch(err){
        next(err);
    }
};

// Get a user controller function. 
export const getUser = async (req,res,next) => {
    
    try{
        // Find user by id return doc from db.
        const user = await User.findById(
            req.params.id
        );
        res.status(200).json(user)
    }catch(err){
        next(err);
    }
};

// Get all users controller function. 
export const getUsers = async (req,res,next) => {
    
    try{
        // Get all user docs from the db and display them.
        const users = await User.find(
        );
        res.status(200).json(users)
    }catch(err){
        next(err)
    }
};