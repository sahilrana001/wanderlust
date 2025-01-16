if(process.env != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate")
// const asyncWrap = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const listings = require("./routes/listing.js")
const reviewRoute = require("./routes/review.js")
const userRoute = require("./routes/users.js")
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./init/models/users.js")

const methodOverride = require("method-override");
const { error } = require('console');
app.use(methodOverride("_method"));


app.engine("ejs", ejsmate);
app.set("view engine ", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));

const dbUrl = process.env.ATLASDB_URL;


const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto :{
        secret :process.env.SECRET,
    },
    touchAfter: 24 * 3600  ,
})

store.on("error" , ()=>{
    console.log("error in mongoStore", err);
    
})

const sessionOptions = {
    store,
    secret:process.env.SECRET ,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}


//session
app.use(session(sessionOptions));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash messages
app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next()
})


main().then((res) => {
    console.log("connection successfull");

}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.listen(port, () => {
    console.log(`app is listening at ${port}`);
});



//listings
app.use("/listings", listings)

//reviews
app.use("/listings/:id/review", reviewRoute)
//users
app.use("/" , userRoute)


//error validation and cast errror

app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        console.log(err.name);
        next(err)
    } else if (err.name === "CasteError") {
        console.log(err.name);
        next(err)
    } else {
        next(err)
    }
})

//route not present

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found"))
})

///error handler
app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("./listings/error.ejs", { message })
})
