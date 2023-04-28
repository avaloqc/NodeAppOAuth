const GoogleStrat = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports =  (passport) => {
    passport.use(new GoogleStrat({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRT,
            callbackURL: '/auth/google/callback'                         
    },
    (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile._json.picture
        }      
        
        User.findOne({googleId: profile.id})
            .then(user => {
            if (user) {done(null, user)}
            else {
                User.create(newUser)
                done(null, user)
                }
            })
            .catch(err => console.log(err))
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id) 
    })

    passport.deserializeUser((id, done) => {
        User.findById(id)
            .then(user => done(null, user))     
            .catch(err => done(err, null))
    })
}