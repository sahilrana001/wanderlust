const User = require("../init/models/users.js");

module.exports.signup = (req,res)=>{
    res.render("./user/signup.ejs")    
};

module.exports.postSignup =async(req,res)=>{
    try{
      let {username,email,password} = req.body;
     const newUser =  new User({email,username})
     let registeredUser = await User.register(newUser,password);
      req.logIn(registeredUser,(err)=>{
          if(err){
              return next(err)
          }else{
              req.flash("success" , "login successfull")
            return  res.redirect("/listings")
          }
      })
     
    }catch(err){
      req.flash("error" , err.message)
      return res.redirect("/signup")
    }
     
      
  };
  module.exports.login = (req,res)=>{
    res.render("./user/login.ejs")
};

module.exports.postLogin = async(req,res)=>{
    req.flash("success" , "welcomeback to wanderlust! ")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}
module.exports.logout =(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err)
        }else{
            req.flash("success" , "you are logged out");
            res.redirect("/listings")
        }
    })
};