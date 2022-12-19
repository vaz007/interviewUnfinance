import jwt from "jsonwebtoken";
import User from "../models/User";
require("dotenv").config();

// Protect Routes
export const protect = async (req, res, next) => {
  try {
    // verify token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // else if(req.cookies.token){
    //     token = req.cookies.token;

    // }
    // make sure token exist
    if (!token) {
      return res
      .status(401)
      .send({ status: "failure", message: "Not Authorized to access this route", body: [] });
 
    }
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
   
  } catch (error) {
    console.log('ERROR FROM MIDDLEWARE :',error);
    if (error.message) {
      res
        .status(400)
        .send({ status: "failure", message: error.message, body: [] });
    } else {
      res
        .status(400)
        .send({ status: "failure", message: "Internal Error", body: [] });
    }
  }
};
