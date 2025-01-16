const mongoose = require("mongoose");
const Review = require("./reviews")

const listingSchema = new mongoose.Schema({

    title:  {
        type:String,
        // required:true,
    },
    description:{
        type:String,
        max:50,
    },
    image:{
        filename: { type: String, default: "default_image" },
        url: {
          type: String,
          default:
            "https://plus.unsplash.com/premium_photo-1683133431252-7c37e0867d41?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:(v)=> v==="" ? "https://plus.unsplash.com/premium_photo-1683133431252-7c37e0867d41?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v ,

        },
      },
       

       
    
    price:{
        type:Number,
        // required:true
        
    },
    location:{
        type:String
    },
    country:{
        type:String
    },
    review:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})


listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
       await Review.deleteMany({_id: {$in: listing.review}})
    }
})

const Listing = mongoose.model("Listing" , listingSchema)

module.exports = Listing;