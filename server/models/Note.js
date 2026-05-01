const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      enum: ["Study", "Career", "Personal", "Ideas"],
      default: "Study"
    },
    emotion: {
      type: String,
      enum: ["Happy", "Motivated", "Neutral", "Stressed"],
      default: "Neutral"
    },
    deadline: {
      type: Date,
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);