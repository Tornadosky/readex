const passport = require('koa-passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();

let googleUsers = [];

const findOrCreateUser = (profile) => {
    /// TODO: add DB support
    let user = googleUsers.find(u => u.id === profile.id);
    if (!user) {
        user = {
            id: profile.id,
            profile: profile
        };
        googleUsers.push(user);
    }
    console.log(user);
    return user;
};

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
}, async (token, tokenSecret, profile, done) => {
    try {
        console.log('[INFO] Authenticating user ' + profile.id);
        const user = findOrCreateUser(profile);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log('[INFO] Serializing user' + user.profile.displayName);
    done(null, user);
    console.log('[INFO] Serializing completed');
});

passport.deserializeUser((user, done) => {
    console.log('[INFO] Deserializing user' + user.profile.displayName);
    done(null, user);
});

module.exports = {passport, googleUsers};