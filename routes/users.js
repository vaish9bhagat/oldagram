var mongoose = require("mongoose");
const passport = require("passport");
var plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/dataone");

var userdata = mongoose.Schema({
  fullname:String,
  Username: String,
  post:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"postdata"

  } ],
  profileImage:String,
  email:String,
  bio:String,
 
  password:String,
  
});
userdata.plugin(plm)

module.exports = mongoose.model("user", userdata);

