import User from "../models/User";

require("dotenv").config();

// @desc: Register User
// @route: Post /register
// @access: Public

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({
      name,
      email,
      password,
    });
    sendTokenResponse(user, 200, res);
  } catch (error) {
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

// @desc: Sign In User / GET USER
// @route: POST /login
// @access: Public

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get a  User
    // validate email and password

    if (!email || !password) {
      return res.status(400).send({
        status: "failure",
        message: "Please provide an email and password",
        body: [],
      });
    }

    // Check for user if it exist
    // +passsword because in model password select is false

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .send({ status: "failure", message: "Invalid Credentials", body: [] });
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);
    console.log(isMatch);
    if (!isMatch) {
      return res
        .status(401)
        .send({ status: "failure", message: "Invalid Credentials", body: [] });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
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

// @desc: Forgot Password
// @route: POST /forgotPassword
// @access: Public

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        status: "failure",
        message: "No User with that email",
        body: [],
      });
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        resetToken,
        user,
      },
    });
  } catch (error) {
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

// @desc:   Reset Password
// @route:  PUT /resetPassword/:resettoken
// @access: Public

export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPassowrdToken: req.params.resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .send({ status: "failure", message: "Invalid Token", body: [] });
    }
    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
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

// @desc: Update USER details
// @route: Put /updateDetails
// @access: Private

export const updateUserDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
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

// @desc: Update USER Password
// @route: PUT /updatePassword
// @access: Private

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    // check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res
      .status(401)
      .send({ status: "failure", message: "Passwords is incorrect", body: [] });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.log('ERROR : ', error)
    if (error.message) {
       return res
          .status(400)
          .send({ status: "failure", message: error.message, body: [] });
      } else {
        return res
          .status(400)
          .send({ status: "failure", message: "Internal Error", body: [] });
      }
  }
};



// Get token from model and create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    status: "success",
    token,
  });
};
