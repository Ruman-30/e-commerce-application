import Redis from "ioredis"
import config from "./config.js"
const redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    username: config.REDIS_USERNAME,
    password: config.REDIS_PASSWORD
})


redis.on("connect", ()=>{
    console.log("Connected to Redis Cloud");
})

redis.on("error", (err)=>{
    console.log("Redis error:", err);
    
})


export default redis