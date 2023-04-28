const passport = require('passport'); //* route should call passport-module
const router = require('express').Router();

router.get('/google', passport.authenticate(
        'google', {scope:['profile']}));    //* Login/auth-token

router.get('/google/callback',             //* google-callback
            passport.authenticate('google', { failureRedirect: '/'}), 
            (req, res) => {
                    res.redirect('/dashboard')
});

//* logout user 
//* /auth/logout
router.get('/logout', (req, res) => {
        req.logout(err => {
            if (err) {return next(err)}
            res.redirect('/')
        });
});
module.exports = router;