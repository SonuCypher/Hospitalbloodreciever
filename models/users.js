const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

const bloodSampleSchema = new mongoose.Schema({
    Hospital:{
        type:String,
    },
    bloodType:{
        type:String,
    }
})


module.exports.Samples = mongoose.model('Samples',bloodSampleSchema)
module.exports.Users = mongoose.model('User',userSchema)