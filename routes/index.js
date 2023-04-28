const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth')
const Story = require('../models/Story')

//* Login/Landing page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'})
})

router.get('/dashboard', ensureAuth, (req, res) => {
    var stories 
    Story.find({user: req.user.id}).lean()
         .then(result=> {
            stories=result
            res.render('dashboard', { name: req.user.firstName, stories})})
         .catch(_err => res.render('error/500'))
});

module.exports = router;