const express = require("express")
const router = express.Router({ mergeParams: true }) //imp for accessing id from parent
const ExpressError = require("../utils/ExpressError.js")
const asyncWrap = require("../utils/wrapAsync.js")
const listing = require("../init/models/listing.js");
const review = require("../init/models/reviews.js");
const { isLogedin , isAuthor} = require("../utils/loggedin.js");
const reviewController = require("../controller/reviews.js")


//review 
//post review
router.post("/",isLogedin, asyncWrap(reviewController.postReview))


//delete review

router.delete("/:reviewID",isLogedin,isAuthor, asyncWrap(reviewController.deleteReview))


module.exports = router;