const Story = require('../models/Story') 
const {ensureAuth} = require('../middleware/auth')

const create_story = (ensureAuth, (req, res) => res.render('stories/add'));

const all_stories = (ensureAuth, (req, res) => {
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
});

const new_story = (ensureAuth, (req, res) => {
    req.body.user = req.user.id      
    Story.create(req.body)
         .then(res.redirect('/dashboard'))
         .catch(_err => res.render('error/500'))
});

const one_story = (ensureAuth, (req, res) => {
    Story.findById(req.params.id)
         .populate('user')    
         .lean()
         .then(story=> {res.render('stories/show', {name: req.user.firstName, story})})
         .catch(_err => res.render('error/500'))
});

const updated_story = (ensureAuth, (req, res) => {
    Story.findById(req.params.id).lean()
         .then((result) => { 
            if (!result) {
                return res.render('error/404')
            }
            if (result.user != req.user.id ) {
                res.redirect('stories')
            } else {
                console.log(req.body);
                Story.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean()
                .then(res.redirect('/dashboard'))
            }
         }) 
         .catch(err => res.render('error/404'));
});

const d_this_story = (ensureAuth, (req, res) => {
    var id = req.params.id
    console.log(req.params.id)
    Story.findById(id).lean()
         .then((result) => {
            if (!result) {
                res.redirect('error/404')
            } else {
                if (result.user == req.user.id) {
                    Story.findByIdAndDelete(id).lean()
                    .then(res.redirect('/dashboard'))
                    .catch(err => res.render('error/500'))
                } else {
                    res.redirect('/stories')
                }}})
        .catch(err => res.render('error/500'));
});

const story_to_edit = (ensureAuth, (req, res) => {
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
 });

const full_story = (ensureAuth, (req, res) => {
    var stories
    Story.find({user: req.params.id, status: 'public'})
         .lean()
         .then((result) => {
            stories = result
            res.render('stories/index', {stories})})
});

module.exports = {
    all_stories, 
    new_story, 
    one_story, 
    updated_story, 
    d_this_story,
    full_story,
    story_to_edit,
    create_story
};