var multer=require("multer")
var {v4:uuidv4}=require("uuid")
var path=require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images/uploads")
    },
    filename: function (req, file, cb) {
      const uniquename=uuidv4()
      cb(null, uniquename  + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports=upload