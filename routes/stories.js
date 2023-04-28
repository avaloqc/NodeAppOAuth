const express = require('express');
const router = express.Router();
const Story = require('../models/Story')
const {all_stories, new_story, d_this_story, updated_story, one_story, full_story, story_to_edit, create_story} = require('../controllers/stories')

router.route('/add')
      .get(create_story)   

router.route('/')
      .get(all_stories)     
      .post(new_story)     

router.route('/:id')        
      .get(one_story)      
      .put(updated_story)
      .delete(d_this_story)

router.route('/user/:id')
      .get(full_story)

router.get('/edit/:id', story_to_edit)


module.exports = router; 