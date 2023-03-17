const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { default: mongoose }=require('mongoose')
const {Users, Samples}=require('./models/users')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const SECRETKEY = "JWTSECRET"


mongoose.connect('mongodb://localhost:27017/Hospital')
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// list  all blood samples
app.get('/bloodsamples',(req,res)=>{
    console.log('all blood samples')
})

// add blood sample(only for hospitals)
app.post('/bloodsamples/add',async(req,res)=>{
    try {
        const {type}=req.body
        const token = req.cookies.jwt
        if(token){
            const decoded = jwt.verify(token,SECRETKEY)
            if(decoded.role === 'hospital'){
                const sample = new Samples({
                  Hospital:decoded.username,
                  bloodType:type

                })
                await sample.save()
                res.send('sample added')
            }else{
                res.send('you dont have permission')
            }

        }else{
            res.send('you need to login')
        }
        
    } catch (error) {
        console.error(error)       
    }

})
// edit blood sample for hospital only
// app.put('/bloodsamples/edit/:id',())

// sign up user
app.post('/signup',async(req,res)=>{
    try{
    const { username ,password,role}=req.body
    const hash = await bcrypt.hash(password, 12);
    const validuser = await Users.findOne({ username:username})
    if(!validuser){
        const user = new Users({
            username,
            password:hash,
            role
        })
        await user.save()

        const token = jwt.sign({ username:user.username, id:user._id, role:user.role },SECRETKEY)
        res.cookie("jwt", token, { httpOnly: true })
        console.log("user saved")
        res.end()
    }else{
        res.send('user already exists')
    }
}catch(err){
    console.error(err)
}
})
//////     login  and logout users
app.post('/login',async(req, res)=>{
    try {
        const {username,password} = req.body
        const user = await Users.findOne({ username: username})
        if(user){
            const validPassword = await bcrypt.compare(password, user.password)
            if(validPassword){
                const token = jwt.sign({ username:user.username, id:user._id, role:user.role },SECRETKEY)
                res.cookie("jwt", token, { httpOnly: true })
                console.log("logged in")
                res.send('logged in')
                res.end()
            }else{
                res.send('incorrect password or user')
            }
        }else{
            res.send('incorrect user or password')
        }
    } catch (error) {
        console.error(error)
    }
})
app.post('/logout',(req,res)=>{
    res.clearCookie("jwt")
    res.send('Logged out')
})

app.listen(3000,()=>{
    console.log('listening on port 3000')
})
