var mongoose = require("mongoose");
var postdata = new mongoose.Schema({
  posttext: {
    type: String,
    required: true,
  },
  image:{
    type:String,

  },
  location:{
    type:String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  postcreated: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  }
});
module.exports = mongoose.model("postdata", postdata);
