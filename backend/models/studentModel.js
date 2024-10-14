const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    parentName: String,
    phoneNo: String,
    address: String,
    bloodGroup: String,
    hobby: String,
});

module.exports = mongoose.model('student', studentSchema);
