const mongoose = require('mongoose');
const dataScheme = new mongoose.Schema({
    name:{
        required: true,
        type: 'string',
    },
    ticket:{
        required: true,
        type: Number
    }
});

module.exports = mongoose.model("Data",dataScheme);