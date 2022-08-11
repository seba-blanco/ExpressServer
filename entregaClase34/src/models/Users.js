const mongoose = require("mongoose");

const { MONGO_URI } = require('../config/global')

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }, () => console.log('Connected'))

const usersCollecion = 'users';

const usersSchema = new mongoose.Schema({
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    email: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max: 100}
})

const users = mongoose.model(usersCollecion, usersSchema);

module.exports = users