import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// Middleware to check is the incoming req has a valid acess token.
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  //If the token is not present, create an error.
  if (!token) {
    console.log("Access token not found in cookies");
    return next(createError(401, "You are not authenticated!"));
  }
  // If the token is present continue.
  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

// Verifies the user's identity before allowing access to a certain endpoint.
export const verifyUser = (req, res, next) => {
    /* receives the user's authentication token in the request object 
    and verifies it using the "verifyToken" function. */
    verifyToken(req, res, (err) => {
      if (err) return next(err);
      /* If the token is valid, the function checks whether the user ID in the request 
      matches the user ID in the token or the user is an administrator. */
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };
  
  // Verifies if the user is an administrator before allowing access to a certain endpoint.
  export const verifyAdmin = (req, res, next) => {
    // If the token is valid, the function checks whether the user has administrator privileges.
    verifyToken(req, res, (err) => {
      if (err) return next(err);
      if (req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not an admin!"));
      }
    });
  };
  