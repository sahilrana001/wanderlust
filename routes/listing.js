const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js")
const asyncWrap = require("../utils/wrapAsync.js")
const listing = require("../init/models/listing.js");
const { isLogedin, isOwner} = require("../utils/loggedin.js");
const listingController = require("../controller/listing.js");
//upload data
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })

//index route
router.route("/")
.get( asyncWrap(listingController.index))
.post(isLogedin, upload.single('image'),asyncWrap(listingController.createListing))




router.get("/:id/show", asyncWrap(listingController.show))


///new listing================================.>>>>>>>

router.get("/new",isLogedin, listingController.newListing)

//create listing========>>>>>>>>>>>>>>.

router

//edit------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.route("/:id/edit")
.get(isLogedin,isOwner, asyncWrap(listingController.edit))
.post(isLogedin,upload.single('image'), isOwner,listingController.update)




///delete===========>>>>>>>>>>>>
router.post("/:id/delete",isLogedin,isOwner, asyncWrap(listingController.delete))

//search 
 
router.get("/search" , asyncWrap(listingController.search))

module.exports = router;