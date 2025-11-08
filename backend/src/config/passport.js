import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import config from "./config.js";
import { createUserByGoogle, FindOneUser } from "../dao/user.dao.js";

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.BACKEND_URL}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user in your database
        let user = await FindOneUser({ googleId: profile.id });
        if(!user){
          user = await createUserByGoogle({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          })  
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
})
);

export default passport;
