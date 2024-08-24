const mongoose=require("mongoose");


const Blogs=mongoose.Schema({
    author: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      urlToImage: {
        type: String, // URL to the image
        required: true,
      },
      publishedAt: {
        type: Date,
        default: Date.now,
      },
      content: {
        type: String,
        required: true,
      },

})


module.exports = mongoose.model("Blogs",Blogs)