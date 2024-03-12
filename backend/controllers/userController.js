const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const UserVerification = require("../models/userVerificationModel");
const nodemailer = require("nodemailer");
const { v4: Uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  from: "ChitChat Official",
});

// testing transporter
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Ready for messages");
//     console.log(success);
//   }
// });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    sendVerificationEmail(user, res);
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

const resendEmail = asyncHandler(async (req, res) => {
  const { userId, email, name } = req.body;

  await UserVerification.find({ userId }).then(async (results) => {
    if (results.length > 0) {
      await UserVerification.deleteOne({ userId }).then(async () => {
        const user = {
          _id: userId,
          email: email,
          name: name,
        };
        sendVerificationEmail(user, res);
      });
    } else {
      const user = {
        _id: userId,
        email: email,
        name: name,
      };
      sendVerificationEmail(user, res);
    }
  });
});

const sendVerificationEmail = ({ _id, email, name }, res) => {
  console.log("data", _id, email, name);
  // url to be used in the email
  const currentUrl = "http://localhost:5000/api/";

  const uniqueString = Uuidv4() + _id;

  // mail option
  const mailOptions = {
    from: "ChitChat",
    to: email,
    subject: "Verify Your Email - ChitChat",
    html: `<Welcome>Hi ${name}, Welcome to ChitChat!</h3>
    <p>Please verify your email address to complete your signup process and then you can login to ChitChat using your login details.</p>
    <p>Please Click <a href="${
      currentUrl + "user/verify/" + _id + "/" + uniqueString
    }">here</a> to proceed.</p>
    <br/>
    <b>This verification link will expires in 6 hours. If this link will expires then login into your account to send new verification link.</b>`,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then(async (hashedUniqueString) => {
      await UserVerification.create({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      })
        .then(() => {
          transporter
            .sendMail(mailOptions)
            .then(() => {
              res.status(201).json({
                status: "PENDING",
                message: "Verification email sent",
              });
            })
            .catch((error) => {
              console.log(error);
              res.json({
                status: "FAILED",
                message: "Verification mail failed!",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: "FAILED",
            message: "Couldn't save verification email data!",
          });
        });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occurred while hashing email data!",
      });
    });
};

const verifyUser = asyncHandler(async (req, res) => {
  let { userId, uniqueString } = req.params;
  console.log("data", req.params);
  await UserVerification.find({ userId })
    .then(async (results) => {
      if (results.length > 0) {
        //user verification record exists and we can proceed
        const { expiresAt } = results[0];
        const hashedUniqueString = results[0].uniqueString;
        // checking for expired unique string
        if (expiresAt < Date.now()) {
          // record has expired so we delete it
          await UserVerification.deleteOne({ userId })
            .then(() => {
              let message =
                "Link has been expired! Please log in to generate the new verification link.";
              res.redirect(`/api/user/verified?error=true&message=${message}`);
            })
            .catch((error) => {
              console.log(error);
              let message =
                "An error occurred while clearing expired user verification record";
              res.redirect(`/api/user/verified?error=true&message=${message}`);
            });
        } else {
          // valid verification link
          // compare the uniqueString
          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then(async (result) => {
              if (result) {
                // strings matched

                await User.updateOne({ _id: userId }, { activated: true })
                  .then(async () => {
                    await UserVerification.deleteOne({ userId })
                      .then(() => {
                        res.sendFile(
                          path.join(__dirname, "../views/verified.html")
                        );
                      })
                      .catch((error) => {
                        // record existed but incorrect unique string
                        let message =
                          "An error occurred while finalizing successful verification.";
                        res.redirect(
                          `/api/user/verified?error=true&message=${message}`
                        );
                      });
                  })
                  .catch((error) => {
                    // record existed but incorrect unique string
                    let message =
                      "An error occurred while updating user record to show verified.";
                    res.redirect(
                      `/api/user/verified?error=true&message=${message}`
                    );
                  });
              } else {
                // record existed but incorrect unique string
                let message =
                  "Invalid verification link. please check your email again.";
                res.redirect(
                  `/api/user/verified?error=true&message=${message}`
                );
              }
            })
            .catch((error) => {
              let message = "An error occurred while comparing unique string.";
              res.redirect(`/api/user/verified?error=true&message=${message}`);
            });
        }
      } else {
        // user verification record doesn't exists
        let message =
          "Account doesn't exist or has been verified already. Please Signup or Login.";
        res.redirect(`/api/user/verified?error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occurred while checking for existing user verification record";
      res.redirect(`/api/user/verified?error=true&message=${message}`);
    });
});

const updateUser = asyncHandler(async (req, res) => {
  const { userId, name, email, status, pic, active, chatBg } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name,
      email,
      pic,
      status,
      active,
      chatBg,
    },
    {
      new: true,
    }
  );

  if (updatedUser) {
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      pic: updatedUser.pic,
      active: updatedUser.active,
      status: updatedUser.status,
      chatBg: updatedUser.chatBg,
      activated: updatedUser.activated,
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    await User.findOneAndUpdate(
      { _id: { $eq: user?._id }, activated: true },
      {
        active: true,
      },
      {
        new: true,
      }
    )
      .then((result) => {
        res.json({
          _id: result._id,
          name: result.name,
          email: result.email,
          pic: result.pic,
          active: result.active,
          status: result.status,
          chatBg: result.chatBg,
          activated: result.activated,
          token: generateToken(result._id),
        });
      })
      .catch((error) => {
        res.json({
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          activated: user?.activated,
        });
        throw new Error("Account is not verified");
      });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user?._id }, activated: true })
    .select("-password");
  res.status(200).send(users);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
  updateUser,
  verifyUser,
  sendVerificationEmail,
  resendEmail,
};
