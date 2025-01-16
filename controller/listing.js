const listing = require("../init/models/listing.js");


module.exports.index =async (req, res) => {
    const allListings = await listing.find({});
    res.render("./listings/index.ejs", { allListings })

}


module.exports.show =async (req, res) => {
    let { id } = req.params;
    // let card = await listing.findOne({ _id: id }) // before
    let card = await listing.findOne({ _id: id })
    .populate({path:"review",
        populate:{path:"author"},
    }).populate("owner")
    console.log(card);
    if(!card){
        req.flash("error" , "listing not found");
        res.redirect("/listings")
    }

    res.render("./listings/show.ejs", { card })


}


module.exports.newListing =(req, res) => {
    res.render("./listings/create.ejs")
}


module.exports.createListing =async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let { title, description, image, price, location, country } = req.body;
    if (!{ title, description, image, price, location, country }) {
        new (new ExpressError(400, "send valid data for listing"))
    };
    let newList = new listing({
        title: title,
        description: description,
        image: {
            url: await url,
            filename: await filename
        },
        price: price,
        location: location,
        country: country,
        owner:req.user._id,
    })
    
    await newList.save().then((res) => {
        console.log(res);
    })

    req.flash("success", "listing created successfully")
    res.redirect("/listings")

};

module.exports.edit = async (req, res) => {

    let { id } = req.params;
    let card = await listing.findOne({ _id: id })
    console.log(card);

    res.render("./listings/edit.ejs", { card })

};

module.exports.update = async(req, res) => {
    let { id } = req.params;

    let { title, description,  price, location, country } = req.body;

    let updatedData =  {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country
    };
    if(req.file){
        let url2 = req.file.path
        let filename2 = req.file.filename
        console.log(url2,filename2);
        updatedData.image={
            url:url2,
            filename:filename2,
        }
        
    }

    await listing.findByIdAndUpdate(id,updatedData).then((res)=>{
        console.log(res);
        
    }).catch((err)=>{
        console.log(err);
        
    })

    req.flash("success" , "updated!!")
    res.redirect(`/listings/${id}/show`)

}
module.exports.delete = async (req, res) => {

    let { id } = req.params;
    await listing.findByIdAndDelete(id)
    req.flash("success" , "Deleted listing ")
    res.redirect("/listings")

}

module.exports.search = async(req,res)=>{
    let query = req.query.query
    let searchResult = await listing.find({country:{$regex: query, $options :"i"}})
    console.log(searchResult);
    res.render("./listings/search.ejs" , {searchResult})
}