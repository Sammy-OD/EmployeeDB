const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const employeeSchema = new Schema({
    user_id: {
        type: ObjectId
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
});


const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;