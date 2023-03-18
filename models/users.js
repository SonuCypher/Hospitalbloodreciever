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
        required:true
    },
    bloodType:{
        type:String,
        required:true
    }
})

const sampleRequestSchema = new mongoose.Schema({
    Receiver:{
        type:String,
        required:true
    },
    Hospital:{
        type:String,
        required:true
    },
    bloodType:{
        type:String,
        required:true
    }

})

module.exports.Requests = mongoose.model('Requests',sampleRequestSchema)
module.exports.Samples = mongoose.model('Samples',bloodSampleSchema)
module.exports.Users = mongoose.model('User',userSchema)