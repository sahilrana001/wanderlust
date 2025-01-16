const listing = require("../init/models/listing.js");
const Review = require("../init/models/reviews.js");



module.exports.isLogedin  = (req,res,next)=>{
    console.log(req.path + "--"+ req.originalUrl);
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "you must login first");
        return res.redirect("/login");
    }
    next()
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let card = await listing.findOne({ _id: id })
    if(!card.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "you are not owner of the listing")
      return res.redirect(`/listings/${id}/show`)
    }
    next()
}
module.exports.isAuthor = async(req,res,next)=>{
    let { id,reviewID } = req.params;

    let review = await Review.findOne({_id: reviewID })
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You did not write this review")
      return res.redirect(`/listings/${id}/show`)
    }
    next()
}