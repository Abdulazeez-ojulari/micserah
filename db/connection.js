const mongoose = require('mongoose');
const config = require('config');
const dbDebugger = require('debug')('joride:db');

module.exports = function () {
    mongoose.connect('mongodb+srv://striker:striker@cluster0.utezj.mongodb.net/micserah?retryWrites=true&w=majority',{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
        .then(() => {dbDebugger('Connected to mongo db')})
        .catch((err) => {dbDebugger('could not connect to db ' + err); console.log(err)})
    
}