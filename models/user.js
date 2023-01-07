const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
})

const User = mongoose.model('User', userSchema);
module.exports = User;