const mon = require("mongoose");

const userSchema = new mon.Schema({
    googleId: {   
        type: String,
        required: true,
    },
    displayName: {   
        type: String,
        required: true,
    },
    firstName: {   
        type: String,
        required: true,
    },
    lastName: {   
        type: String,
        required: true,
    },
    image: {   
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {timestamp: true}
);

module.exports = mon.model('User', userSchema);