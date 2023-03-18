const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { default: mongoose }=require('mongoose')
const {Users, Samples, Requests}=require('./models/users')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const SECRETKEY = "JWTSECRET"
const { AllSamples, ListHospitalSamples, addBloodSamples,editBloodSamples, deleteBloodSamples } = require('./controllers/bloodsample')
const { addBloodRequest, listBloodRequest } = require('./controllers/bloodrequest')
const { signUp, login, logout } = require('./controllers/users')


mongoose.connect('mongodb://localhost:27017/Hospital')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// ///// list  all blood samples //////
app.get('/bloodsamples',AllSamples)

//////// add blood sample(only for hospitals) ////////////////////
app.post('/bloodsamples/add',addBloodSamples)

/////// edit blood sample for hospital only/////////////////////
app.put('/bloodsamples/edit/:id', editBloodSamples)

/////// delete the blood samples only for HOSPITALS////////////////////
app.delete('/bloodsamples/delete/:id',deleteBloodSamples)

////// GET the blood samples of the respective hospitals ;
app.get('/bloodsamples/list',ListHospitalSamples)



///// POST REQUEST FOR BLOOD SAMPLE (ONLY FOR RECIEVERS) HERE ID(HEADER IS SAMPLE ID) //////
app.post('/bloodsamples/request/:id',addBloodRequest)

/////////// GET request SO RESPECTIVE HOSPITAL CAN GET LIST OF REQUEST MADE TO THEM(ONLY FOR HOSPITAL)
app.get('/bloodsamples/request/list',listBloodRequest)




///////////////// sign up user////////////////
app.post('/signup',signUp)

//////     login  and logout users ////////////////////////
app.post('/login',login)
app.post('/logout',logout)

app.listen(3000,()=>{
    console.log('listening on port 3000')
})
