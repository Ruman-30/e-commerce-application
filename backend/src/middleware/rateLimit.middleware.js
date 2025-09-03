import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis.js";

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => {
      try {
        return await redis.call(...args);
      } catch (error) {
        console.error("Redis error in rate limiter:", error);
        return null;
      }
    },
  }),
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => {
    return  `${ipKeyGenerator(req)}:${req.path}`;
  },
  message: {
    status: 429,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
