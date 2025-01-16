const listing = require("../init/models/listing.js");
const review = require("../init/models/reviews.js");

module.exports.postReview = async (req, res) => {
    let { id } = req.params;
    let listingDetail = await listing.findById(id)
    let newReview = new review(req.body.review)
    newReview.author = req.user._id;
    console.log(newReview);

    
    listingDetail.review.push(newReview);
    
    
    await newReview.save();
    await listingDetail.save();


    // show objid review

    let showReview = async () => {
        let res = await listing.findById(id).populate("review")
        console.log(res);

    }
    showReview();

    req.flash("success", "Added review !")
    res.redirect(`/listings/${id}/show`)
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewID } = req.params;

    await listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
    await review.findByIdAndDelete(reviewID);

    req.flash("success", "Deleted review !")
    res.redirect(`/listings/${id}/show`)


}
