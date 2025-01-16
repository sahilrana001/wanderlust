const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("./models/listing.js");


 main().then((res)=>{
    console.log("connection successfull");
    
}).catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initDb = async ()=>{
    await Listing.deleteMany({}).then((res)=>{
        console.log("data deleted successfully");
        
    })
    initData.data=initData.data.map((obj)=>({...obj,owner:"677ff8ea2c7152df6e71d8f4",}));
    await Listing.insertMany(initData.data).then((res)=>{
        console.log("data was initialised")
        console.log(res);
        
        
    }).catch((err)=>{
        console.log(err);
        
    })
};

initDb();
