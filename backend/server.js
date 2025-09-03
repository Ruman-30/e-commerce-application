import app from "./src/app.js"
import config from "./src/config/config.js"
import connectToDb from "./src/db/db.js";
connectToDb()
app.listen(config.PORT, ()=>{
    console.log(`server is running on port ${config.PORT}`);
    
})