const mongoose = require("mongoose");

const userVerificationSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    uniqueString: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const UserVerification = mongoose.model(
  "UserVerification",
  userVerificationSchema
);

module.exports = UserVerification;
