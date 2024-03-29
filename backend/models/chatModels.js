const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    chatDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isGroupChat: { type: Boolean, default: false },
    groupPic: { type: String },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
