const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:String,
    age:String,
    gender:String,
    mobile:String,
});
const user = mongoose.model('User', userSchema);
module.exports = user;