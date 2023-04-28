const Schema = require('mongoose');
const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
        },
    body: {
        type: String,
        required: true,
        },
    status: {
        type: String,
        required: true,
        default: 'public',
        enum: ['public', 'private']
        },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
        }, 
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Story = mongoose.model('Story', StorySchema)
module.exports = Story;
