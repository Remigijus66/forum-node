const mongoose = require("mongoose")
const Schema = mongoose.Schema

const forumUserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  breed: {
    type: String,
    required: false
  },
  color: {
    type: String,
    required: false
  },
  hair: {
    type: String,
    required: false
  },
  messages: {
    type: Number,
    required: false
  }


})

module.exports = mongoose.model("forumUser", forumUserSchema)