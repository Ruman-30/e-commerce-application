import mongoose from "mongoose";
import config from "../config/config.js";
function connectToDb (){
    mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        console.log("connected to db");
        
    })
    .catch((err)=>{
        console.log(err);
        
    })
}

export default connectToDb