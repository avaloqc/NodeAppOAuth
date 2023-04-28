const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth')
const Story = require('../models/Story')

router.get('/add', ensureAuth, (req, res) => res.render('stories/add'))

router.get('/', ensureAuth, (req, res) => {
    var stories
    req.body.user = req.user.id  
    Story.find({status: 'public'})
         .populate('user')                               //* ----- loads data from another collection
         .sort({createdAt: 'desc'}) 
         .lean()
         .then(result=> {
            stories=result
            res.render('stories/index', {stories})})
         .catch(_err => res.render('error/500'))
})
router.post('/', ensureAuth, (req, res) => {
    req.body.user = req.user.id              //* req.body is an object
    Story.create(req.body)
         .then(res.redirect('/dashboard'))
         .catch(_err => res.render('error/500'))
})
router.get('/:id', ensureAuth, (req, res) => {
    Story.findById(req.params.id)
         .populate('user')    
         .lean()
         .then(story=> {res.render('stories/show', {name: req.user.firstName, story})})
         .catch(_err => res.render('error/500'))
})
router.put('/:id', ensureAuth, (req, res) => {
   Story.findById(req.params.id).lean()
        .then((result) => { 
           if (!result) {
               return res.render('error/404')
           }
           if (result.user != req.user.id ) {
               res.redirect('stories')
           } else {
               Story.findByIdAndUpdate(req.params.id, req.body, {new: true, runvalidatros:true})
               res.redirect('/dashboard')
           }
        }) 
        .catch(err => res.render('error/404'));
})
router.delete('/:id', ensureAuth, (req, res) => {
    const id = req.params.id
    Story.findById(id).lean()
         .then((result) => {
            if (!result) {
                res.redirect('error/404')
            } else {
                if (result.user == id) {
                    Story.findByIdAndDelete(id)
                    .then(res.redirect('/dashboard'))
                } else {
                    res.redirect('/stories')
                }}})
        .catch(err => {res.render('error/500')});
}) 
router.get('/user/:id', ensureAuth, (req, res) => {
    var stories
    Story.find({user: req.params.id, status: 'public'})
         .lean()
         .then((result) => {
            stories = result
            res.render('stories/index', {stories})})
})
router.get('/edit/:id', ensureAuth, (req, res) => {
   var story
   Story.findOne({_id: req.params.id})
        .lean()
        .then((result) => {
           story=result  
           if (!story) {return res.render('error/404')}
           if (story.user != req.user.id) {res.redirect('stories')} 
           else {res.render('stories/edit', {story})}
        }) 
        .catch(err => res.render('error/500'));
})


module.exports = router; 